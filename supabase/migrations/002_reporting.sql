-- P5: reporting tables, policies and role-based read access

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  day date not null,
  status text not null check (status in ('present','absent','late','excused')),
  unique (student_id, class_id, day)
);

create table if not exists student_evaluations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  term text not null,
  session text not null,
  affective jsonb not null default '{}'::jsonb,
  psychomotor jsonb not null default '{}'::jsonb,
  teacher_remark text,
  updated_at timestamptz default now(),
  unique (student_id, term, session)
);

alter table attendance enable row level security;
alter table student_evaluations enable row level security;

-- classes: any signed-in user can read
create policy "read classes" on classes for select to authenticated using (true);

-- profiles
create policy "read own profile" on profiles for select to authenticated using (id = auth.uid());
create policy "teachers read class students" on profiles for select to authenticated using (
  id in (
    select e.student_id from enrollments e
    join subjects s on s.class_id = e.class_id
    where s.teacher_id = auth.uid()
  )
);
create policy "parents read linked students" on profiles for select to authenticated using (
  id in (select student_id from parent_links where parent_id = auth.uid())
);

-- enrollments
create policy "read own enrollment" on enrollments for select to authenticated using (student_id = auth.uid());
create policy "teachers read class enrollments" on enrollments for select to authenticated using (
  class_id in (select class_id from subjects where teacher_id = auth.uid())
);
create policy "parents read linked enrollments" on enrollments for select to authenticated using (
  student_id in (select student_id from parent_links where parent_id = auth.uid())
);

-- grades
create policy "students read own grades" on grades for select to authenticated using (student_id = auth.uid());
create policy "parents read linked grades" on grades for select to authenticated using (
  student_id in (select student_id from parent_links where parent_id = auth.uid())
);

-- attendance
create policy "teachers manage attendance" on attendance for all to authenticated
  using (class_id in (select class_id from subjects where teacher_id = auth.uid()))
  with check (class_id in (select class_id from subjects where teacher_id = auth.uid()));
create policy "students read own attendance" on attendance for select to authenticated using (student_id = auth.uid());

-- evaluations (affective + psychomotor + remark)
create policy "teachers manage evaluations" on student_evaluations for all to authenticated
  using (student_id in (
    select e.student_id from enrollments e
    join subjects s on s.class_id = e.class_id
    where s.teacher_id = auth.uid()
  ))
  with check (student_id in (
    select e.student_id from enrollments e
    join subjects s on s.class_id = e.class_id
    where s.teacher_id = auth.uid()
  ));
create policy "students read own evaluations" on student_evaluations for select to authenticated using (student_id = auth.uid());
create policy "parents read linked evaluations" on student_evaluations for select to authenticated using (
  student_id in (select student_id from parent_links where parent_id = auth.uid())
);

-- admissions: admins only (service role / admin role)
create policy "admins read admissions" on admissions for select to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admins update admissions" on admissions for update to authenticated using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);
