# משימה ל-Claude Code (רץ על המק של אלמוג)

אתה בתיקיית `voice-lab`. המטרה: סקיצות קריינות בעברית בקול המשוכפל של אלמוג, עם בדיקות הגייה ואינטונציה.
הכול חינמי ומקומי (Chatterbox Multilingual + dicta-onnx + Whisper + parselmouth). אין להשתמש בשום API בתשלום.

1. הרץ `./run.sh` ועקוב אחרי `logs/run.log`. הסקריפט מתקין venv, מוריד מודלים, מכייל, מייצר, מעריך ומפיק דוח.
2. אם משהו נכשל: תקן את הסיבה (התקנה, גרסת פייתון, MPS) והרץ שוב. ריצה חוזרת מדלגת על מה שכבר נוצר.
   - שגיאת MPS: `python generate.py --device cpu`.
   - Whisper לא נטען: `python evaluate.py --asr-model medium` או `--no-asr`.
   - חסר ffmpeg רק ל-make_ref.sh (ה-ref כבר קיים ב-`ref/`). אל תיגע בקבצים ב-`ref/`.
3. אל תשנה את `tests.txt` / `scripts.txt` ואל תמחק סקיצות. אל תשנה את המבנה של manifest.jsonl.
4. בסיום ודא ש-`REPORT.md` ו-`review.html` קיימים ושיש לפחות 10 קבצי WAV ב-`sketches/`. כתוב סיכום קצר בעברית ב-`logs/SUMMARY.md`.
