#!/usr/bin/env python3
"""Generate Hebrew voice sketches in Almog's cloned voice.

Engine: Chatterbox Multilingual (Resemble AI, MIT, runs locally, Hebrew supported) + Dicta nikud (dicta-onnx).
No API keys, no paid services.

Usage:
  python generate.py --calibrate          # try every ref/prompt_*.wav on one line, pick the most similar voice
  python generate.py                      # all items in tests.txt + scripts.txt, two variants each (calm / expressive)
  python generate.py --only scripts       # or --only tests
  python generate.py --engine dry         # pipeline smoke test without the model (writes synthetic tones)
  python generate.py --prompt ref/prompt_2.wav --variants calm

Re-running skips WAVs that already exist. One line per WAV is appended to manifest.jsonl.
"""
import argparse
import json
import logging
import math
import os
import sys
import time
import traceback

import numpy as np
import soundfile as sf

from common import (CALIB_JSON, MODELS_DIR, OUT_DIR, REF_DIR, ROOT, append_manifest, list_prompts, load_items,
                    ref_full, strip_nikud)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("generate")

VARIANTS = {
    # exaggeration: emotion/energy; cfg_weight: lower = freer, more expressive; temperature: sampling randomness
    "calm": dict(exaggeration=0.4, cfg_weight=0.5, temperature=0.7),
    "expressive": dict(exaggeration=0.7, cfg_weight=0.3, temperature=0.8),
}
CALIB_TEXT = "קוראים לי אלמוג כהן. הערב הזה מתחיל עכשיו, והרחבה כבר מחכה."


# ----------------------------------------------------------------------------- engines
class DryEngine:
    """Writes a synthetic signal so evaluate.py / report.py can be exercised without the model."""
    sr = 24000

    def __init__(self, device=None):
        pass

    def nikud(self, text):
        return text

    def generate(self, text, prompt_path, exaggeration=0.5, cfg_weight=0.5, temperature=0.8):
        seconds = max(1.0, 0.07 * len(text))
        t = np.linspace(0, seconds, int(self.sr * seconds), endpoint=False)
        f0 = 120 + 30 * exaggeration
        # pitch drifts down (statement) or up (question) so the intonation metrics have something to see
        drift = 1.25 if text.strip().endswith("?") else 0.85
        freq = f0 * (1 + (drift - 1) * t / seconds)
        phase = 2 * np.pi * np.cumsum(freq) / self.sr
        sig = 0.3 * np.sin(phase) + 0.1 * np.sin(2 * phase) + 0.02 * np.random.randn(len(t))
        env = np.clip(np.sin(np.pi * t / seconds) * 3, 0, 1)
        return (sig * env).astype(np.float32)


class ChatterboxEngine:
    def __init__(self, device="auto"):
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS

        if device == "auto":
            if torch.cuda.is_available():
                device = "cuda"
            elif getattr(torch.backends, "mps", None) and torch.backends.mps.is_available():
                device = "mps"
            else:
                device = "cpu"
        self.device = device
        torch.set_num_threads(max(1, os.cpu_count() or 1))
        log.info("loading Chatterbox Multilingual on %s (first run downloads ~2GB from Hugging Face)", device)
        # the s3gen/conds checkpoints are saved for CUDA; map to the target device when loading
        if device != "cuda":
            _orig_load = torch.load

            def _patched_load(*a, **kw):
                kw.setdefault("map_location", device if device != "mps" else "cpu")
                return _orig_load(*a, **kw)

            torch.load = _patched_load
        self.model = ChatterboxMultilingualTTS.from_pretrained(device=device)
        self.sr = self.model.sr
        self._dicta = self._load_dicta()

    def _load_dicta(self):
        """Chatterbox calls dicta_onnx.Dicta() with no model path, which fails silently and leaves Hebrew
        without nikud. Load the model ourselves and inject it so the built-in path works."""
        try:
            from dicta_onnx import Dicta
            import chatterbox.models.tokenizers.tokenizer as tk
            cands = sorted(MODELS_DIR.glob("dicta-*.onnx"))
            if not cands:
                log.warning("no models/dicta-*.onnx found - Hebrew will be synthesised WITHOUT nikud (worse pronunciation)")
                return None
            d = Dicta(str(cands[0]))
            tk._dicta = d
            log.info("dicta nikud model loaded: %s", cands[0].name)
            return d
        except Exception as e:  # noqa: BLE001
            log.warning("dicta not available (%s) - Hebrew will be synthesised WITHOUT nikud", e)
            return None

    def nikud(self, text):
        if self._dicta is None:
            return text
        try:
            return self._dicta.add_diacritics(strip_nikud(text))
        except Exception as e:  # noqa: BLE001
            log.warning("nikud failed for %r: %s", text, e)
            return text

    def generate(self, text, prompt_path, exaggeration=0.5, cfg_weight=0.5, temperature=0.8):
        wav = self.model.generate(
            text,
            language_id="he",
            audio_prompt_path=str(prompt_path),
            exaggeration=exaggeration,
            cfg_weight=cfg_weight,
            temperature=temperature,
        )
        return wav.squeeze(0).detach().cpu().numpy().astype(np.float32)


def make_engine(name, device):
    if name == "dry":
        return DryEngine()
    try:
        return ChatterboxEngine(device)
    except Exception as e:  # noqa: BLE001
        if device in ("auto", "mps"):
            log.warning("engine failed on %s (%s); retrying on cpu", device, e)
            return ChatterboxEngine("cpu")
        raise


# ----------------------------------------------------------------------------- helpers
def trim_silence(wav, sr, thresh_db=-45.0, pad=0.15):
    if len(wav) == 0:
        return wav
    frame = int(sr * 0.02)
    n = len(wav) // frame
    if n == 0:
        return wav
    rms = np.sqrt(np.mean(wav[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms + 1e-9)
    idx = np.where(db > thresh_db)[0]
    if len(idx) == 0:
        return wav
    s = max(0, idx[0] * frame - int(pad * sr))
    e = min(len(wav), (idx[-1] + 1) * frame + int(pad * sr))
    return wav[s:e]


def normalise(wav, peak=0.89):
    m = np.max(np.abs(wav)) if len(wav) else 0
    return wav * (peak / m) if m > 0 else wav


def synth_one(engine, item, variant, prompt, out_path, retries=2):
    params = VARIANTS[variant]
    text = item["text"]
    text_nikud = engine.nikud(text)
    err = None
    for attempt in range(1, retries + 2):
        t0 = time.time()
        try:
            wav = engine.generate(text, prompt, **params)
            wav = normalise(trim_silence(wav, engine.sr))
            dur = len(wav) / engine.sr
            if dur < 0.3:
                raise RuntimeError(f"output too short ({dur:.2f}s)")
            out_path.parent.mkdir(parents=True, exist_ok=True)
            sf.write(str(out_path), wav, engine.sr, subtype="PCM_16")
            row = dict(id=item["id"], kind=item["kind"], variant=variant, text=text, text_nikud=text_nikud,
                       note=item["note"], prompt=str(prompt.relative_to(ROOT)), params=params,
                       path=str(out_path.relative_to(ROOT)), seconds=round(dur, 2),
                       gen_seconds=round(time.time() - t0, 1), engine=type(engine).__name__, attempt=attempt,
                       error=None)
            append_manifest(row)
            log.info("ok %s [%s] %.1fs audio in %.0fs", item["id"], variant, dur, time.time() - t0)
            return row
        except Exception as e:  # noqa: BLE001
            err = f"{type(e).__name__}: {e}"
            log.warning("attempt %d failed for %s [%s]: %s", attempt, item["id"], variant, err)
            log.debug(traceback.format_exc())
    row = dict(id=item["id"], kind=item["kind"], variant=variant, text=text, text_nikud=text_nikud, note=item["note"],
               prompt=str(prompt.relative_to(ROOT)), params=params, path=str(out_path.relative_to(ROOT)),
               seconds=0, gen_seconds=0, engine=type(engine).__name__, attempt=retries + 1, error=err)
    append_manifest(row)
    return row


def pick_prompt(args):
    if args.prompt:
        return ROOT / args.prompt
    if CALIB_JSON.exists():
        try:
            best = json.loads(CALIB_JSON.read_text())["best_prompt"]
            p = ROOT / best
            if p.exists():
                log.info("using calibrated prompt %s", best)
                return p
        except Exception:  # noqa: BLE001
            pass
    ps = list_prompts()
    if not ps:
        sys.exit("no ref/prompt_*.wav found - run make_ref.sh first")
    return ps[min(1, len(ps) - 1)]


def calibrate(engine):
    """Synthesise one line with every prompt clip and keep the one whose voice is closest to the full reference."""
    from evaluate import speaker_similarity_fn
    sim_fn = speaker_similarity_fn(engine)
    full = ref_full()
    results = []
    item = dict(id="calib", kind="calib", text=CALIB_TEXT, note="calibration")
    for p in list_prompts():
        out = OUT_DIR / "_calibration" / f"calib__{p.stem}.wav"
        row = synth_one(engine, item, "calm", p, out, retries=1)
        sim = None
        if row["error"] is None and full is not None:
            try:
                sim = float(sim_fn(out, full))
            except Exception as e:  # noqa: BLE001
                log.warning("similarity failed: %s", e)
        results.append(dict(prompt=str(p.relative_to(ROOT)), path=row["path"], similarity=sim, error=row["error"]))
        log.info("calibration %s -> similarity %s", p.name, None if sim is None else round(sim, 3))
    ok = [r for r in results if r["similarity"] is not None]
    best = max(ok, key=lambda r: r["similarity"])["prompt"] if ok else (results[0]["prompt"] if results else None)
    CALIB_JSON.write_text(json.dumps(dict(best_prompt=best, results=results), ensure_ascii=False, indent=2))
    log.info("best prompt: %s", best)
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default="chatterbox", choices=["chatterbox", "dry"])
    ap.add_argument("--device", default="auto")
    ap.add_argument("--prompt", default="")
    ap.add_argument("--only", default="all", choices=["all", "tests", "scripts"])
    ap.add_argument("--variants", default="calm,expressive")
    ap.add_argument("--calibrate", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    engine = make_engine(args.engine, args.device)
    if args.calibrate:
        calibrate(engine)
        return

    prompt = pick_prompt(args)
    variants = [v for v in args.variants.split(",") if v in VARIANTS]
    items = load_items(args.only)
    if args.limit:
        items = items[: args.limit]
    todo = [(it, v) for it in items for v in variants]
    done = fail = skipped = 0
    for i, (it, v) in enumerate(todo, 1):
        out = OUT_DIR / f"{it['id']}__{v}.wav"
        if out.exists() and out.stat().st_size > 1000:
            skipped += 1
            continue
        log.info("(%d/%d) %s [%s]: %s", i, len(todo), it["id"], v, it["text"][:60])
        row = synth_one(engine, it, v, prompt, out)
        if row["error"]:
            fail += 1
        else:
            done += 1
    log.info("finished: %d generated, %d failed, %d skipped (already existed)", done, fail, skipped)
    if done == 0 and fail > 0:
        sys.exit(2)


if __name__ == "__main__":
    main()
