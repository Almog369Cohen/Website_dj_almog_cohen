#!/usr/bin/env python3
"""Build REPORT.md (Hebrew summary) and review.html (audio players + metrics) from manifest.jsonl + eval.json."""
import html
import json
from datetime import datetime

from common import CALIB_JSON, EVAL_JSON, ROOT, read_manifest

KIND_HE = {"pron": "הגייה", "inton": "אינטונציה", "script": "סקיצות שיווקיות", "calib": "כיול"}
VAR_HE = {"calm": "רגוע", "expressive": "אקספרסיבי"}
FLAG_HE = {
    "generation_failed": "הייצור נכשל", "empty_or_silent": "ריק או שקט", "clipping": "עיוות (clipping)",
    "mostly_silence": "רובו שקט", "voice_not_similar": "לא דומה לקול שלך", "pronunciation_suspect": "הגייה חשודה",
    "monotone": "מונוטוני", "odd_duration": "אורך לא הגיוני", "not_evaluated": "לא נבדק",
}


def score(e):
    if e.get("error"):
        return -1
    s = 0.0
    sim = e.get("similarity")
    cer = e.get("cer")
    s += 60 * (sim if sim is not None else 0.6)
    s += 40 * (1 - min(1.0, cer if cer is not None else 0.4))
    s -= 15 * len([f for f in e.get("flags", []) if f not in ("monotone",)])
    s -= 5 * ("monotone" in e.get("flags", []))
    return round(s, 1)


def fmt(v, pct=False):
    if v is None:
        return "—"
    return f"{v * 100:.0f}%" if pct else str(v)


def main():
    ev = json.loads(EVAL_JSON.read_text(encoding="utf-8")) if EVAL_JSON.exists() else {"items": []}
    items = ev.get("items", [])
    if not items:  # evaluation never ran: fall back to manifest only
        for r in read_manifest():
            items.append(dict(r, flags=["not_evaluated"] if not r.get("error") else ["generation_failed"]))
    for e in items:
        e["score"] = score(e)
    calib = json.loads(CALIB_JSON.read_text()) if CALIB_JSON.exists() else None
    ref = ev.get("reference") or {}
    ok = [e for e in items if not e.get("error")]
    failed = [e for e in items if e.get("error")]
    clean = [e for e in ok if not e.get("flags")]
    by_kind = {}
    for e in items:
        by_kind.setdefault(e["kind"], []).append(e)
    best = sorted(ok, key=lambda e: -e["score"])[:5]
    total_audio = sum((e.get("health") or {}).get("seconds", e.get("seconds", 0) or 0) for e in ok)

    # ------------------------------------------------------------------ REPORT.md
    L = []
    L.append(f"# דוח שיבוט קול - {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    L.append("## שורה תחתונה\n")
    L.append(f"- נוצרו **{len(ok)}** סקיצות ({total_audio:.0f} שניות אודיו), **{len(failed)}** נכשלו, "
             f"**{len(clean)}** עברו את כל הבדיקות האוטומטיות בלי דגל.")
    if ref:
        rp = ref.get("pitch", {})
        L.append(f"- הקול המקורי שלך: גובה חציוני {fmt(rp.get('f0_median_hz'))} Hz, טווח {fmt(rp.get('range_semitones'))} חצאי-טון.")
    if calib:
        L.append(f"- דגימת הקול שנבחרה אוטומטית: `{calib.get('best_prompt')}` "
                 f"(דמיון: " + ", ".join(f"{r['prompt'].split('/')[-1]}={fmt(r['similarity'])}" for r in calib.get('results', [])) + ").")
    if ev.get("asr_model"):
        L.append(f"- בדיקת הגייה: תמלול עם Whisper `{ev['asr_model']}` והשוואה לטקסט המקורי (CER = אחוז תווים שגויים).")
    else:
        L.append("- בדיקת ההגייה האוטומטית (Whisper) לא רצה; ההגייה נבדקת באוזן בלבד.")
    L.append("- לשמוע הכול: לפתוח את `review.html` בדפדפן (נגנים, תמלול ומדדים לכל סקיצה).\n")

    if best:
        L.append("## 5 הסקיצות הטובות ביותר (לפי ציון אוטומטי)\n")
        L.append("| ציון | סקיצה | גרסה | דמיון קול | CER | סוף משפט | קובץ |")
        L.append("|---|---|---|---|---|---|---|")
        for e in best:
            L.append(f"| {e['score']} | {e['id']} | {VAR_HE.get(e['variant'], e['variant'])} | {fmt(e.get('similarity'))} | "
                     f"{fmt(e.get('cer'), True)} | {(e.get('pitch') or {}).get('end_contour', '—')} | `{e['path']}` |")
        L.append("")

    if "pron" in by_kind:
        L.append("## בדיקות הגייה\n")
        L.append("| מבחן | גרסה | מה לבדוק | תמלול Whisper | CER | דגלים |")
        L.append("|---|---|---|---|---|---|")
        for e in sorted(by_kind["pron"], key=lambda x: (x["id"], x["variant"])):
            L.append(f"| {e['id']} | {VAR_HE.get(e['variant'], e['variant'])} | {e.get('note', '')} | "
                     f"{e.get('transcript', '—') if not e.get('error') else 'נכשל'} | {fmt(e.get('cer'), True)} | "
                     f"{', '.join(FLAG_HE.get(f, f) for f in e.get('flags', [])) or 'תקין'} |")
        L.append("")
        L.append("הערה: Whisper עצמו טועה בעברית, אז CER נמוך (<15%) טוב, 15-35% לבדוק באוזן, מעל 35% כנראה בעיית הגייה אמיתית. "
                 "לכל סקיצה שמור גם הטקסט המנוקד שהמודל קיבל (`text_nikud` ב-manifest.jsonl): אם הניקוד שגוי, ההגייה תהיה שגויה.\n")

    if "inton" in by_kind:
        L.append("## בדיקות אינטונציה\n")
        L.append("| מבחן | גרסה | ציפייה | סוף משפט | שיפוע סוף (חצאי טון) | טווח (חצאי טון) | גובה חציוני | דגלים |")
        L.append("|---|---|---|---|---|---|---|---|")
        for e in sorted(by_kind["inton"], key=lambda x: (x["id"], x["variant"])):
            p = e.get("pitch") or {}
            L.append(f"| {e['id']} | {VAR_HE.get(e['variant'], e['variant'])} | {e.get('note', '')} | {p.get('end_contour', '—')} | "
                     f"{fmt(p.get('end_slope_semitones'))} | {fmt(p.get('range_semitones'))} | {fmt(p.get('f0_median_hz'))} | "
                     f"{', '.join(FLAG_HE.get(f, f) for f in e.get('flags', [])) or 'תקין'} |")
        L.append("")
        for c in ev.get("intonation_checks", []):
            L.append(f"- [{'עבר' if c['passed'] else 'נכשל'}] {VAR_HE.get(c['variant'], c['variant'])}: {c['check']} "
                     f"({', '.join(f'{k}={v}' for k, v in c.items() if k not in ('variant', 'check', 'passed'))})")
        L.append("")

    if "script" in by_kind:
        L.append("## סקיצות שיווקיות\n")
        L.append("| סקיצה | גרסה | אורך | דמיון קול | CER | ציון | דגלים |")
        L.append("|---|---|---|---|---|---|---|")
        for e in sorted(by_kind["script"], key=lambda x: (x["id"], x["variant"])):
            L.append(f"| {e['id']} | {VAR_HE.get(e['variant'], e['variant'])} | {(e.get('health') or {}).get('seconds', '—')}s | "
                     f"{fmt(e.get('similarity'))} | {fmt(e.get('cer'), True)} | {e['score']} | "
                     f"{', '.join(FLAG_HE.get(f, f) for f in e.get('flags', [])) or 'תקין'} |")
        L.append("")

    if failed:
        L.append("## כשלונות\n")
        for e in failed:
            L.append(f"- {e['id']} [{e.get('variant')}]: `{e.get('error')}`")
        L.append("")

    L.append("## איך לקרוא את המספרים\n")
    L.append("- **דמיון קול**: קוסינוס בין טביעת הקול של הסקיצה לקול שלך מההקלטה. מעל 0.80 = כמעט לא מבדילים, 0.70-0.80 = דומה, מתחת ל-0.60 = מישהו אחר.")
    L.append("- **CER**: אחוז התווים שהתמלול לא תאם לטקסט. משקף הגייה, אבל גם טעויות של Whisper.")
    L.append("- **סוף משפט**: rise = עולה (שאלה), fall = יורד (קביעה), flat = שטוח. נמדד ב-300 מ\"ש האחרונות של הדיבור.")
    L.append("- **טווח**: הפרש בין הגובה הגבוה לנמוך (אחוזונים 10-90). מתחת ל-2.5 = מונוטוני.\n")
    L.append("## הצעד הבא\n")
    L.append("1. להאזין ל-5 הטובות ב-`review.html` ולסמן מה נשמע כמוך ומה לא.")
    L.append("2. אם הדמיון נמוך בכל הסקיצות: להקליט דגימה חדשה של 30-60 שניות, בלי מוזיקה ברקע, בטון שאתה רוצה לשכפל.")
    L.append("3. אם ההגייה שגויה במילה מסוימת: לכתוב אותה עם ניקוד ידני בטקסט (המודל מכבד ניקוד קיים).")
    L.append("4. לייצר טקסטים חדשים: להוסיף שורות ל-`scripts.txt` ולהריץ `./run.sh` שוב (מדלג על מה שכבר קיים).")
    (ROOT / "REPORT.md").write_text("\n".join(L), encoding="utf-8")

    # ------------------------------------------------------------------ review.html
    def card(e):
        p = e.get("pitch") or {}
        h = e.get("health") or {}
        flags = "".join(f'<span class="flag">{html.escape(FLAG_HE.get(f, f))}</span>' for f in e.get("flags", []))
        audio = (f'<audio controls preload="none" src="{html.escape(e["path"])}"></audio>'
                 if not e.get("error") else f'<div class="err">נכשל: {html.escape(str(e.get("error")))}</div>')
        tr = e.get("transcript")
        return f"""
<div class="card" data-kind="{e['kind']}" data-variant="{e['variant']}">
  <div class="head"><b>{html.escape(e['id'])}</b> <span class="var">{VAR_HE.get(e['variant'], e['variant'])}</span>
    <span class="score">ציון {e['score']}</span>{flags}</div>
  <div class="text">{html.escape(e['text'])}</div>
  {f'<div class="nikud">{html.escape(e["text_nikud"])}</div>' if e.get('text_nikud') and e.get('text_nikud') != e['text'] else ''}
  <div class="note">להקשיב ל: {html.escape(e.get('note', ''))}</div>
  {audio}
  {f'<div class="tr">תמלול: {html.escape(tr)} <span class="m">(CER {fmt(e.get("cer"), True)})</span></div>' if tr else ''}
  <div class="metrics">דמיון קול {fmt(e.get('similarity'))} · אורך {h.get('seconds', '—')}s · סוף {p.get('end_contour', '—')} ·
    טווח {fmt(p.get('range_semitones'))} חצאי טון · F0 {fmt(p.get('f0_median_hz'))} Hz · שקט {fmt(h.get('silence_ratio'))}</div>
  <label class="rate">הדירוג שלך: <select onchange="save('{html.escape(e['path'])}', this.value)"><option value="">—</option>
    <option>זה אני</option><option>כמעט</option><option>לא אני</option><option>הגייה שגויה</option></select></label>
</div>"""

    sections = []
    for kind in ("script", "pron", "inton", "calib"):
        if kind in by_kind:
            cards = "".join(card(e) for e in sorted(by_kind[kind], key=lambda x: (-x["score"], x["id"])))
            sections.append(f'<h2>{KIND_HE.get(kind, kind)} ({len(by_kind[kind])})</h2><div class="grid">{cards}</div>')
    ref_html = ""
    if ref:
        ref_html = (f'<div class="card ref"><div class="head"><b>הקול המקורי שלך</b></div>'
                    f'<audio controls preload="none" src="{html.escape(ref.get("path", ""))}"></audio>'
                    f'<div class="metrics">F0 {fmt(ref.get("pitch", {}).get("f0_median_hz"))} Hz · טווח '
                    f'{fmt(ref.get("pitch", {}).get("range_semitones"))} חצאי טון</div></div>')
    page = f"""<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>סקיצות קול - אלמוג</title>
<style>
body{{font-family:-apple-system,Arial,sans-serif;margin:24px;background:#f6f6f8;color:#222}}
h1{{margin:0 0 4px}} .sub{{color:#666;margin-bottom:20px}} h2{{margin-top:32px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:14px}}
.card{{background:#fff;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.08)}}
.card.ref{{border:2px solid #4a7}} .head{{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}}
.var{{background:#eef;border-radius:6px;padding:2px 8px;font-size:12px}} .score{{background:#efe;border-radius:6px;padding:2px 8px;font-size:12px}}
.flag{{background:#fdd;color:#900;border-radius:6px;padding:2px 8px;font-size:12px}}
.text{{font-size:17px;margin:6px 0}} .nikud{{color:#555;font-size:15px}} .note{{color:#777;font-size:13px;margin-bottom:6px}}
audio{{width:100%;margin:6px 0}} .tr{{font-size:14px;color:#345}} .m{{color:#888}} .metrics{{font-size:12px;color:#666;margin-top:6px}}
.err{{color:#900}} .rate{{display:block;margin-top:8px;font-size:13px}} .filters{{margin:10px 0}} .filters button{{margin-left:6px}}
</style></head><body>
<h1>סקיצות קול - אלמוג כהן</h1><div class="sub">{len(ok)} סקיצות, {len(failed)} כשלונות · נוצר {datetime.now().strftime('%Y-%m-%d %H:%M')}
· הדירוגים שלך נשמרים בדפדפן ואפשר להוריד אותם בכפתור</div>
<div class="filters">סינון: <button onclick="filt('')">הכול</button><button onclick="filt('calm')">רגוע</button>
<button onclick="filt('expressive')">אקספרסיבי</button> <button onclick="dl()">הורד דירוגים (JSON)</button></div>
{ref_html}{''.join(sections)}
<script>
const K='almog-voice-ratings';let R=JSON.parse(localStorage.getItem(K)||'{{}}');
function save(p,v){{R[p]=v;localStorage.setItem(K,JSON.stringify(R));}}
function filt(v){{document.querySelectorAll('.card[data-variant]').forEach(c=>c.style.display=(!v||c.dataset.variant===v)?'':'none');}}
function dl(){{const a=document.createElement('a');a.href='data:application/json,'+encodeURIComponent(JSON.stringify(R,null,2));a.download='my-ratings.json';a.click();}}
document.querySelectorAll('select').forEach(s=>{{const p=s.getAttribute('onchange').split("'")[1];if(R[p])s.value=R[p];}});
</script></body></html>"""
    (ROOT / "review.html").write_text(page, encoding="utf-8")
    print(f"REPORT.md + review.html written: {len(ok)} ok, {len(failed)} failed, best={[e['id'] for e in best]}")


if __name__ == "__main__":
    main()
