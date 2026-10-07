# Voice Lab - שיבוט הקול של אלמוג (חינמי, מקומי)

יוצר סקיצות קריינות בעברית בקול של אלמוג, ובודק אוטומטית הגייה, אינטונציה ודמיון קול.
אין API בתשלום ואין שירות ענן: הכול רץ על המק.

## הפעלה (פעם אחת)

1. לשים את ההקלטה המנוקה ב-`ref/` (כבר נעשה: `ref/prompt_1..3.wav`, `ref/ref_full_clean.wav`).
   להקלטה חדשה: `./make_ref.sh "/path/to/recording.wav"`.
2. לחיצה כפולה על `START.command` ב-Finder, או בטרמינל:
   ```bash
   cd ~/almog-creator-lab/voice-lab && caffeinate -dims ./run.sh
   ```
3. בסיום לפתוח `REPORT.md` (סיכום) ו-`review.html` (נגנים + מדדים + דירוג ידני).

הפעם הראשונה מורידה כ-3GB חבילות + כ-2GB משקלי מודל (Chatterbox מ-Hugging Face, dicta מ-GitHub, Whisper מ-OpenAI).

## מה רץ

| שלב | קובץ | מה קורה |
|---|---|---|
| התקנה | `setup.sh` | venv עם Python 3.11 (דרך uv), חבילות, מודל ניקוד |
| כיול | `generate.py --calibrate` | משפט אחד עם כל דגימת קול, בחירת הדומה ביותר (`calibration.json`) |
| ייצור | `generate.py` | כל שורה ב-`tests.txt` + `scripts.txt`, בשתי גרסאות: רגוע / אקספרסיבי |
| הערכה | `evaluate.py` | Whisper (תמלול מול הטקסט = CER), Praat (גובה, טווח, סוף משפט), טביעת קול (דמיון) |
| דוח | `report.py` | `REPORT.md` + `review.html` |

## מנועים ומקורות (כולם בקוד פתוח)

- **Chatterbox Multilingual** (Resemble AI, MIT) - TTS עם שכפול קול מ-10-20 שניות, תומך עברית.
- **dicta-onnx** - ניקוד אוטומטי (Chatterbox מצפה לניקוד; בלי זה ההגייה גרועה). הטקסט המנוקד נשמר ב-`manifest.jsonl`.
- **openai-whisper** - תמלול לבדיקת הגייה. **praat-parselmouth** - ניתוח גובה צליל. **Resemblyzer** - דמיון דובר.

## פקודות שימושיות

```bash
ONLY=scripts ./run.sh                 # רק סקיצות שיווקיות
VARIANTS=calm ./run.sh                # רק גרסה רגועה
ENGINE=dry ./run.sh                   # בדיקת צינור בלי המודל (צלילים סינתטיים)
.venv/bin/python generate.py --device cpu --only tests
.venv/bin/python evaluate.py --asr-model medium
```

לייצר טקסטים חדשים: להוסיף שורות ל-`scripts.txt` (פורמט `id|script|טקסט|מה להקשיב`) ולהריץ שוב.
מילה שנהגית לא נכון: לכתוב אותה עם ניקוד ידני בטקסט.
