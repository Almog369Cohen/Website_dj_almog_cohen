-- רבר הפקות · מערכת ניהול — סכמה ראשונית
-- גישה: כניסה עם Google (Supabase Auth). רק מי שרשום בטבלת members נכנס.
-- מנהל (admin) = הכל. צוות (team) = לידים, יומן, הודעות + מה שסומן לו (כספים / מחיקה / תבניות).
-- ההרשאות נאכפות כאן במסד הנתונים (RLS), לא רק במסך.

create table if not exists members (
  id text primary key,                -- אימייל חשבון הגוגל, באותיות קטנות
  name text not null,
  role text not null default 'team' check (role in ('admin','team')),
  can_finance boolean not null default false,
  can_delete boolean not null default false,
  can_templates boolean not null default false,
  active boolean not null default true,
  created_at timestamptz default now()
);

create or replace function me_email() returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where id = me_email() and active);
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members where id = me_email() and active and role = 'admin');
$$;

create or replace function has_perm(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from members where id = me_email() and active and (
      role = 'admin'
      or (p = 'finance' and can_finance)
      or (p = 'delete' and can_delete)
      or (p = 'templates' and can_templates)
    )
  );
$$;

-- האם יש משתמשים בכלל (למסך "הגדרה ראשונה")
create or replace function members_exist() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from members);
$$;

-- המשתמש הראשון שנכנס הופך למנהל. עובד רק כשאין אף משתמש.
create or replace function claim_first_admin(p_name text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if me_email() = '' then raise exception 'not signed in'; end if;
  lock table members in exclusive mode;
  if exists (select 1 from members) then raise exception 'המערכת כבר הוגדרה'; end if;
  insert into members (id, name, role, can_finance, can_delete, can_templates)
  values (me_email(), p_name, 'admin', true, true, true);
end $$;
revoke all on function claim_first_admin(text) from public, anon;
grant execute on function claim_first_admin(text) to authenticated;

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

-- RLS
do $$
declare t text;
begin
  foreach t in array array['leads','activities','calendar_items','templates','payments','expenses','docs','settings','members'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists team_all on %I', t);
    execute format('drop policy if exists p_select on %I', t);
    execute format('drop policy if exists p_insert on %I', t);
    execute format('drop policy if exists p_update on %I', t);
    execute format('drop policy if exists p_delete on %I', t);
  end loop;
end $$;

-- עבודה שוטפת (כל הצוות): לידים, היסטוריה, יומן. מחיקה = הרשאת מחיקה.
do $$
declare t text;
begin
  foreach t in array array['leads','activities','calendar_items'] loop
    execute format('create policy p_select on %I for select to authenticated using (is_member())', t);
    execute format('create policy p_insert on %I for insert to authenticated with check (is_member())', t);
    execute format('create policy p_update on %I for update to authenticated using (is_member()) with check (is_member())', t);
    execute format('create policy p_delete on %I for delete to authenticated using (has_perm(''delete''))', t);
  end loop;
end $$;

-- כספים: רק מנהלים או מי שקיבל הרשאת כספים
do $$
declare t text;
begin
  foreach t in array array['payments','expenses','docs'] loop
    execute format('create policy p_select on %I for select to authenticated using (has_perm(''finance''))', t);
    execute format('create policy p_insert on %I for insert to authenticated with check (has_perm(''finance''))', t);
    execute format('create policy p_update on %I for update to authenticated using (has_perm(''finance'')) with check (has_perm(''finance''))', t);
    execute format('create policy p_delete on %I for delete to authenticated using (has_perm(''finance'') and has_perm(''delete''))', t);
  end loop;
end $$;

-- תבניות: כולם קוראים, עריכה = הרשאת תבניות
create policy p_select on templates for select to authenticated using (is_member());
create policy p_insert on templates for insert to authenticated with check (has_perm('templates'));
create policy p_update on templates for update to authenticated using (has_perm('templates')) with check (has_perm('templates'));
create policy p_delete on templates for delete to authenticated using (has_perm('templates'));

-- הגדרות וצוות: כולם קוראים, רק מנהלים משנים
create policy p_select on settings for select to authenticated using (is_member());
create policy p_insert on settings for insert to authenticated with check (is_admin());
create policy p_update on settings for update to authenticated using (is_admin()) with check (is_admin());
create policy p_select on members for select to authenticated using (is_member());
create policy p_insert on members for insert to authenticated with check (is_admin());
create policy p_update on members for update to authenticated using (is_admin()) with check (is_admin());
create policy p_delete on members for delete to authenticated using (is_admin() and id <> me_email());

-- הערה: עמודת המחיר בלידים מוסתרת במסך לצוות בלי הרשאת כספים (לא ברמת המסד).

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

-- את המנהלים הראשונים אפשר להכניס כאן (או: הראשון שנכנס למערכת הופך למנהל):
-- insert into members (id, name, role, can_finance, can_delete, can_templates)
-- values ('gal@gmail.com', 'גל', 'admin', true, true, true), ('liel@gmail.com', 'ליאל', 'admin', true, true, true);
