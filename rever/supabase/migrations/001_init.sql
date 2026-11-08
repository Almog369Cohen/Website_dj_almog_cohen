-- רבר הפקות · מערכת ניהול — סכמה ראשונית
-- גישה: רק משתמשים מחוברים שהאימייל שלהם רשום בטבלת members.

create table if not exists members (
  email text primary key,
  name text,
  created_at timestamptz default now()
);

create or replace function is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

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
  at timestamptz not null default now()
);
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
  vat_rate numeric not null default 18
);

-- RLS: חברי צוות בלבד
do $$
declare t text;
begin
  foreach t in array array['leads','activities','calendar_items','templates','payments','expenses','docs','settings'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists team_all on %I', t);
    execute format('create policy team_all on %I for all to authenticated using (is_member()) with check (is_member())', t);
  end loop;
end $$;
alter table members enable row level security;
drop policy if exists members_read on members;
create policy members_read on members for select to authenticated using (is_member());

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

-- להוסיף את הצוות (להחליף באימיילים האמיתיים):
-- insert into members (email, name) values ('rever.isr@gmail.com', 'ענבל ורועי');
