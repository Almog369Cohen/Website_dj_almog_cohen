#!/usr/bin/env python3
"""Objective checks on every sketch: pronunciation (Whisper transcript vs. target text), intonation (pitch
contour via Praat/parselmouth), voice similarity (speaker embedding vs. the real reference), and audio health.

All local and free. Writes eval.json. Usage: python evaluate.py [--no-asr] [--asr-model turbo]
"""
import argparse
import json
import logging
import math
import sys

import numpy as np
import soundfile as sf

from common import EVAL_JSON, ROOT, normalize_for_cer, read_manifest, ref_full

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("evaluate")


# ----------------------------------------------------------------------------- audio helpers
def load_mono(path, sr=None):
    wav, fs = sf.read(str(path), dtype="float32", always_2d=True)
    wav = wav.mean(axis=1)
    if sr and fs != sr:
        import librosa
        wav = librosa.resample(wav, orig_sr=fs, target_sr=sr)
        fs = sr
    return wav, fs


def audio_health(wav, sr):
    dur = len(wav) / sr
    peak = float(np.max(np.abs(wav))) if len(wav) else 0.0
    rms = float(np.sqrt(np.mean(wav ** 2))) if len(wav) else 0.0
    frame = max(1, int(sr * 0.02))
    n = max(1, len(wav) // frame)
    f_rms = np.sqrt(np.mean(wav[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12)
    silent = float(np.mean(20 * np.log10(f_rms + 1e-9) < -45))
    clipped = float(np.mean(np.abs(wav) > 0.985)) if len(wav) else 0.0
    return dict(seconds=round(dur, 2), peak_db=round(20 * math.log10(peak + 1e-9), 1),
                rms_db=round(20 * math.log10(rms + 1e-9), 1), silence_ratio=round(silent, 2),
                clipping_ratio=round(clipped, 4))


def pitch_stats(path):
    """F0 statistics + final contour (rise / fall / flat) using Praat's pitch tracker."""
    try:
        import parselmouth
    except ImportError:
        return dict(error="parselmouth missing")
    snd = parselmouth.Sound(str(path))
    pitch = snd.to_pitch(time_step=0.01, pitch_floor=60, pitch_ceiling=400)
    f0 = pitch.selected_array["frequency"]
    t = pitch.xs()
    voiced = f0 > 0
    if voiced.sum() < 10:
        return dict(voiced_ratio=round(float(voiced.mean()), 2), error="too little voiced speech")
    v = f0[voiced]
    tv = t[voiced]
    st = 12 * np.log2(v / 100.0)  # semitones re 100 Hz
    # end contour: compare the last 300 ms of voiced speech with the 300 ms before it
    end = tv[-1]
    last = st[tv > end - 0.30]
    prev = st[(tv > end - 0.60) & (tv <= end - 0.30)]
    slope = float(np.median(last) - np.median(prev)) if len(last) >= 3 and len(prev) >= 3 else 0.0
    contour = "rise" if slope > 1.5 else ("fall" if slope < -1.5 else "flat")
    # overall tilt across the utterance (semitones per second)
    tilt = float(np.polyfit(tv, st, 1)[0]) if len(tv) > 5 else 0.0
    return dict(f0_median_hz=round(float(np.median(v)), 1), f0_p10_hz=round(float(np.percentile(v, 10)), 1),
                f0_p90_hz=round(float(np.percentile(v, 90)), 1),
                range_semitones=round(float(np.percentile(st, 90) - np.percentile(st, 10)), 2),
                voiced_ratio=round(float(voiced.mean()), 2), end_slope_semitones=round(slope, 2),
                end_contour=contour, tilt_st_per_s=round(tilt, 2))


# ----------------------------------------------------------------------------- speaker similarity
def speaker_similarity_fn(engine=None):
    """Return fn(path_a, path_b) -> cosine similarity in [0,1]. Prefers Resemblyzer (bundled weights);
    falls back to Chatterbox's own voice encoder when an engine is given."""
    try:
        from resemblyzer import VoiceEncoder, preprocess_wav
        enc = VoiceEncoder("cpu", verbose=False)

        def fn(a, b):
            ea = enc.embed_utterance(preprocess_wav(str(a)))
            eb = enc.embed_utterance(preprocess_wav(str(b)))
            return float(np.dot(ea, eb) / (np.linalg.norm(ea) * np.linalg.norm(eb) + 1e-9))

        log.info("speaker similarity: Resemblyzer")
        return fn
    except Exception as e:  # noqa: BLE001
        log.warning("Resemblyzer unavailable (%s)", e)
    if engine is not None and hasattr(engine, "model"):
        ve = engine.model.ve

        def fn(a, b):
            wa, _ = load_mono(a, 16000)
            wb, _ = load_mono(b, 16000)
            ea = ve.embeds_from_wavs([wa], sample_rate=16000).mean(axis=0)
            eb = ve.embeds_from_wavs([wb], sample_rate=16000).mean(axis=0)
            return float(np.dot(ea, eb) / (np.linalg.norm(ea) * np.linalg.norm(eb) + 1e-9))

        log.info("speaker similarity: Chatterbox voice encoder")
        return fn
    log.warning("no speaker encoder available - similarity will be null")
    return lambda a, b: None


# ----------------------------------------------------------------------------- ASR
class ASR:
    def __init__(self, model_name="turbo"):
        import torch
        import whisper
        self.whisper = whisper
        last = None
        for name in [model_name, "medium", "small"]:
            try:
                log.info("loading Whisper '%s' (downloads once)", name)
                self.model = whisper.load_model(name, device="cpu")
                self.name = name
                return
            except Exception as e:  # noqa: BLE001
                last = e
                log.warning("Whisper '%s' failed: %s", name, e)
        raise RuntimeError(f"no Whisper model could be loaded: {last}")

    def transcribe(self, path):
        wav, _ = load_mono(path, 16000)
        res = self.model.transcribe(wav, language="he", fp16=False, temperature=0.0, condition_on_previous_text=False)
        words = sum(len(s["text"].split()) for s in res.get("segments", []))
        speech = sum(s["end"] - s["start"] for s in res.get("segments", []))
        return res["text"].strip(), (round(words / speech, 2) if speech > 0 else None)


def cer_wer(target, hyp):
    import jiwer
    t, h = normalize_for_cer(target), normalize_for_cer(hyp)
    if not t:
        return None, None
    if not h:
        return 1.0, 1.0
    return round(float(jiwer.cer(t, h)), 3), round(float(jiwer.wer(t, h)), 3)


# ----------------------------------------------------------------------------- main
def flags_for(e):
    f = []
    h = e.get("health", {})
    if e.get("error"):
        f.append("generation_failed")
        return f
    if h.get("seconds", 0) < 0.5 or h.get("peak_db", -99) < -30:
        f.append("empty_or_silent")
    if h.get("clipping_ratio", 0) > 0.001:
        f.append("clipping")
    if h.get("silence_ratio", 0) > 0.5:
        f.append("mostly_silence")
    sim = e.get("similarity")
    if sim is not None and sim < 0.60:
        f.append("voice_not_similar")
    cer = e.get("cer")
    if cer is not None and cer > 0.35:
        f.append("pronunciation_suspect")
    p = e.get("pitch", {})
    if p.get("range_semitones") is not None and p["range_semitones"] < 2.5:
        f.append("monotone")
    exp = e.get("expected_seconds")
    if exp and h.get("seconds") and (h["seconds"] > 2.2 * exp or h["seconds"] < 0.45 * exp):
        f.append("odd_duration")
    return f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-asr", action="store_true")
    ap.add_argument("--asr-model", default="turbo")
    args = ap.parse_args()

    rows = read_manifest()
    if not rows:
        sys.exit("manifest.jsonl is empty - run generate.py first")
    full = ref_full()
    sim_fn = speaker_similarity_fn()
    asr = None
    if not args.no_asr:
        try:
            asr = ASR(args.asr_model)
        except Exception as e:  # noqa: BLE001
            log.warning("ASR disabled: %s", e)

    ref_stats = None
    if full is not None:
        try:
            ref_stats = dict(path=str(full.relative_to(ROOT)), pitch=pitch_stats(full))
            wav, sr = load_mono(full)
            ref_stats["health"] = audio_health(wav, sr)
            if asr is not None:
                txt, rate = asr.transcribe(full)
                ref_stats["transcript"] = txt
                ref_stats["words_per_second"] = rate
        except Exception as e:  # noqa: BLE001
            log.warning("reference analysis failed: %s", e)

    out = []
    for i, r in enumerate(rows, 1):
        e = dict(id=r["id"], kind=r["kind"], variant=r["variant"], text=r["text"], text_nikud=r.get("text_nikud"),
                 note=r.get("note", ""), path=r["path"], prompt=r.get("prompt"), error=r.get("error"))
        p = ROOT / r["path"]
        if r.get("error") or not p.exists():
            e["error"] = r.get("error") or "file missing"
            e["flags"] = flags_for(e)
            out.append(e)
            continue
        try:
            wav, sr = load_mono(p)
            e["health"] = audio_health(wav, sr)
            e["expected_seconds"] = round(0.075 * len(normalize_for_cer(r["text"])), 1)
            e["pitch"] = pitch_stats(p)
            e["similarity"] = None if full is None else sim_fn(p, full)
            if e["similarity"] is not None:
                e["similarity"] = round(e["similarity"], 3)
            if asr is not None:
                txt, rate = asr.transcribe(p)
                e["transcript"] = txt
                e["words_per_second"] = rate
                e["cer"], e["wer"] = cer_wer(r["text"], txt)
        except Exception as ex:  # noqa: BLE001
            e["error"] = f"evaluation failed: {ex}"
        e["flags"] = flags_for(e)
        out.append(e)
        log.info("(%d/%d) %s [%s] sim=%s cer=%s contour=%s flags=%s", i, len(rows), e["id"], e["variant"],
                 e.get("similarity"), e.get("cer"), e.get("pitch", {}).get("end_contour"), e["flags"])

    # intonation pair checks: same words, different punctuation
    pairs = {}
    for e in out:
        if e["kind"] == "inton" and e["id"] in ("i01_statement", "i02_question", "i03_exclaim"):
            pairs.setdefault(e["variant"], {})[e["id"]] = e.get("pitch", {})
    inton_checks = []
    for v, d in pairs.items():
        s, q = d.get("i01_statement", {}), d.get("i02_question", {})
        if s.get("end_slope_semitones") is not None and q.get("end_slope_semitones") is not None:
            inton_checks.append(dict(variant=v, check="question ends higher than statement",
                                     statement_end=s["end_slope_semitones"], question_end=q["end_slope_semitones"],
                                     passed=q["end_slope_semitones"] > s["end_slope_semitones"] + 0.5))
        x = d.get("i03_exclaim", {})
        if x.get("range_semitones") is not None and s.get("range_semitones") is not None:
            inton_checks.append(dict(variant=v, check="exclamation has wider pitch range than statement",
                                     statement_range=s["range_semitones"], exclaim_range=x["range_semitones"],
                                     passed=x["range_semitones"] > s["range_semitones"]))

    result = dict(reference=ref_stats, asr_model=getattr(asr, "name", None), items=out, intonation_checks=inton_checks)
    EVAL_JSON.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    ok = [e for e in out if not e.get("error")]
    log.info("evaluated %d sketches (%d with errors) -> eval.json", len(ok), len(out) - len(ok))


if __name__ == "__main__":
    main()
