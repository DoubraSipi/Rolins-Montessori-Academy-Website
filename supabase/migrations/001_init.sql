-- P1: Rolins core schema (Postgres / Supabase-compatible, RLS)
-- Run in Supabase SQL editor or `supabase db push`.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin','teacher','student','parent')),
  phone text,
  created_at timestamptz default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text not null check (section in ('nursery','primary','secondary')),
  created_at timestamptz default now()
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  name text not null,
  teacher_id uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  session text not null,
  unique (student_id, class_id, session)
);

create table if not exists parent_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  unique (parent_id, student_id)
);

create table if not exists lms_courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists lms_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references lms_courses(id) on delete cascade,
  title text not null,
  content_markdown text,
  attachment_url text,
  created_at timestamptz default now()
);

create table if not exists lms_assignments (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  due_date timestamptz,
  max_points int not null default 100,
  created_at timestamptz default now()
);

create table if not exists lms_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references lms_assignments(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  r2_key text,
  score numeric,
  feedback text,
  created_at timestamptz default now(),
  unique (assignment_id, student_id)
);

create table if not exists grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  term text not null,
  session text not null,
  ca1_score numeric default 0,
  ca2_score numeric default 0,
  exam_score numeric default 0,
  unique (student_id, subject_id, term, session)
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  term text not null,
  session text not null,
  r2_key text,
  generated_at timestamptz default now()
);

create table if not exists admissions (
  id uuid primary key default gen_random_uuid(),
  pupil_name text not null,
  entry_class text not null,
  parent_contact text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);

create table if not exists email_outbox (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  template text not null,
  payload jsonb,
  status text not null default 'queued',
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table grades enable row level security;
alter table lms_submissions enable row level security;
alter table enrollments enable row level security;
alter table reports enable row level security;

-- Teachers write grades only for own subjects; students read own rows.
-- Refine per Supabase Auth uid() in app wiring (P1 follow-up).
