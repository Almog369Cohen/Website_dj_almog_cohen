-- רבר הפקות · מערכת ניהול — סכמה ראשונית
-- גישה:
-- 1. המכשיר נכנס עם חשבון הגוגל של העסק (ALLOWED_GOOGLE_EMAILS).
-- 2. כל עובד בוחר את עצמו ומקיש קוד אישי. השרת של המערכת בודק את הקוד ומנפיק סשן.
-- 3. כל הקריאות והכתיבות עוברות דרך השרת (service role), שמסנן לפי הרשאות העובד.
--    לכן ב-RLS אין מדיניות לדפדפן בכלל: anon / authenticated לא ניגשים לטבלאות ישירות.

create table if not exists members (
  id text primary key,
  name text not null,
  title text,
  role text not null default 'team' check (role in ('admin','team')),  -- admin = קוד מאסטר
  can_prices boolean not null default false,
  can_finance boolean not null default false,
  can_delete boolean not null default false,
  can_templates boolean not null default false,
  active boolean not null default true,
  pin_hash text,                          -- scrypt(salt) — הקוד עצמו לא נשמר
  failed_attempts int not null default 0,
  locked_until timestamptz,
  last_login timestamptz,
  created_at timestamptz default now()
);

create table if not exists leads (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  event_type text not null default 'אחר',
  event_date date,
  guests int,
  venue text,
  source text not null default 'אחר',
  status text not null default 'new' check (status in ('new','talk','meeting','quote','won','lost')),
  price numeric,
  next_followup timestamptz,
  followup_note text,
  pending_message text,
  last_contact timestamptz,
  notes text,
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz default now()
);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_followup_idx on leads(next_followup);

create table if not exists activities (
  id text primary key,
  lead_id text not null references leads(id) on delete cascade,
  kind text not null,
  text text not null,
  at timestamptz not null default now(),
  by text
);
alter table leads add column if not exists assigned_to text;
alter table activities add column if not exists by text;
create index if not exists activities_lead_idx on activities(lead_id);

create table if not exists calendar_items (
  id text primary key,
  kind text not null check (kind in ('event','meeting','followup')),
  title text not null,
  start timestamptz not null,
  location text,
  lead_id text references leads(id) on delete set null
);

create table if not exists templates (
  id text primary key,
  name text not null,
  description text not null default '',
  body text not null,
  sort int not null default 0
);

create table if not exists payments (
  id text primary key,
  lead_id text not null references leads(id) on delete cascade,
  kind text not null check (kind in ('deposit','payment','refund')),
  amount numeric not null,
  date date not null,
  method text not null,
  note text
);

create table if not exists expenses (
  id text primary key,
  date date not null,
  amount numeric not null,
  category text not null,
  supplier text not null,
  note text,
  lead_id text references leads(id) on delete set null
);

create table if not exists docs (
  id text primary key,
  lead_id text not null references leads(id) on delete cascade,
  type text not null check (type in ('quote','invoice','receipt')),
  number text not null,
  amount numeric not null,
  date date not null,
  status text not null check (status in ('draft','sent','paid','cancelled'))
);

create table if not exists settings (
  id text primary key,
  business_name text not null default 'רבר הפקות',
  owner_name text not null default '',
  whatsapp_mode text not null default 'link' check (whatsapp_mode in ('link','webhook')),
  make_webhook_url text,
  vat_rate numeric not null default 18,
  sheet_url text,
  sheet_map text,
  sheet_auto boolean default false,
  sheet_last_pull timestamptz
);
alter table settings add column if not exists sheet_url text;
alter table settings add column if not exists sheet_map text;
alter table settings add column if not exists sheet_auto boolean default false;
alter table settings add column if not exists sheet_last_pull timestamptz;

-- RLS: נעילה מלאה לדפדפן. רק השרת (service role) ניגש.
do $$
declare t text; p record;
begin
  foreach t in array array['leads','activities','calendar_items','templates','payments','expenses','docs','settings','members'] loop
    execute format('alter table %I enable row level security', t);
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on %I', p.policyname, t);
    end loop;
    execute format('revoke all on %I from anon, authenticated', t);
  end loop;
end $$;

-- נתוני פתיחה
insert into settings (id) values ('main') on conflict do nothing;
insert into templates (id, sort, name, description, body) values
 ('t1',1,'👋 הודעת היכרות','לליד חדש, בפעם הראשונה','היי {שם}! 🎉 כאן {בעלים} מ{עסק}. ראינו שהשארתם פרטים ל{אירוע} ב-{תאריך}, מזל טוב! מתי נוח לכם לשיחה קצרה?'),
 ('t2',2,'🔁 פולואפ: לא ענו','אחרי 2 ימים בלי תשובה','היי {שם} 😊 רק מוודאת שההודעה הקודמת הגיעה. נשמח לשמוע על ה{אירוע} ולהתאים לכם הצעה. מתאים לכם לדבר מחר בערב?'),
 ('t3',3,'📅 אישור פגישה','יום לפני הפגישה, עם שעה ומקום','היי {שם}, רק מזכירה שנפגשים {פגישה}. מחכים לכם! אם משהו משתנה, תכתבו לי כאן 🙏'),
 ('t4',4,'📄 בדיקה אחרי הצעת מחיר','3 ימים אחרי שליחת ההצעה','היי {שם}, רציתי לבדוק אם יצא לכם לעבור על הצעת המחיר ששלחנו. יש שאלות? אשמח לעבור עליה יחד בטלפון.'),
 ('t5',5,'💳 תזכורת מקדמה','אחרי שסגרו','היי {שם}, איזה כיף שסגרנו! 🥂 כדי לשריין את התאריך ({תאריך}) נשמח לקבל את המקדמה. פרטי ההעברה מצורפים.'),
 ('t6',6,'🙏 תודה אחרי האירוע','בקשת המלצה וביקורת בגוגל','היי {שם}, תודה שבחרתם בנו! היה אירוע מדהים ❤️ נשמח מאוד אם תכתבו לנו כמה מילים בגוגל, זה עוזר לנו המון.')
on conflict do nothing;

-- העובדים נוצרים מתוך המערכת: הראשון שנכנס יוצר מאסטר עם קוד, ומשם מוסיפים את השאר בהגדרות.
