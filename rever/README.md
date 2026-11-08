# רבר הפקות · מערכת ניהול

מערכת ניהול לידים ואירועים: **היום** (פולואפים + יומן), **לידים**, **כרטיס ליד** עם שליחת וואטסאפ מתבניות, **יומן**, **כספים**, **תבניות הודעה**, **הגדרות**.

## הרצה מקומית
```bash
cd rever
npm install
npm run dev        # http://localhost:3100
```
בלי משתני סביבה המערכת רצה ב**מצב דמו**: נתוני דוגמה נשמרים בדפדפן בלבד.

## חיבור Supabase (נתונים אמיתיים + כניסה עם מייל)
1. ליצור פרויקט Supabase ולהריץ את `supabase/migrations/001_init.sql` ב-SQL Editor.
2. להוסיף את אנשי הצוות: `insert into members (email, name) values ('...', '...');`
3. להעתיק את `.env.example` ל-`.env.local` ולמלא `NEXT_PUBLIC_SUPABASE_URL` ו-`NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. ב-Supabase → Authentication → URL Configuration: להוסיף את כתובת האתר.

## וואטסאפ
- **ברירת מחדל:** נפתח וואטסאפ עם ההודעה מוכנה (wa.me). עובד מיד, בלי חיבור.
  תזמון במצב הזה = ההודעה נשמרת ומופיעה בפולואפים בזמן שנקבע, ונשלחת בלחיצה.
- **אוטומטי דרך Make:** בהגדרות לבחור "שליחה דרך Make" ולהדביק כתובת Webhook.
  המערכת שולחת `POST` עם `{type, phone, name, message, send_at, lead_id}` ו-Make מעביר ל-WhatsApp API / ManyChat.

## קליטת לידים מ-Make / Meta Lead Ads
`POST /api/leads` עם header `x-webhook-secret` ו-JSON:
`{ name, phone, email?, event_type?, event_date?, guests?, venue?, source?, notes? }`.
דורש `SUPABASE_SERVICE_ROLE_KEY` ו-`LEADS_WEBHOOK_SECRET`. טלפון שכבר קיים לא יוצר כפילות, רק מקפיץ פולואפ.

## עוד לא מחובר (שלב הבא)
- סנכרון יומן גוגל
- הפקת חשבוניות במורנינג / iCount (כרגע המסמכים נרשמים למעקב בלבד)
- סטטיסטיקות קמפיינים ממטא
