-- Demo data for report-card testing. Safe to re-run.
-- Assumes: one class named 'Primary 3', at least one subject, and a teacher assigned.

-- 1. Give every auth user without a profile row one (repairs missing profiles)
insert into profiles (id, full_name, role)
select u.id,
       coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1)),
       coalesce(nullif(u.raw_user_meta_data->>'role', ''), 'student')
from auth.users u
where not exists (select 1 from profiles p where p.id = u.id);

-- 2. Enrol the student in Primary 3
insert into enrollments (student_id, class_id, session)
select p.id, c.id, '2026/2027'
from profiles p
join classes c on c.name = 'Primary 3'
where p.role = 'student'
on conflict (student_id, class_id, session) do nothing;

-- 3. Scores for every subject in that class
insert into grades (student_id, subject_id, term, session, ca1_score, ca2_score, exam_score)
select p.id, s.id, 'first', '2026/2027', 26, 27, 34
from profiles p
cross join subjects s
join classes c on c.id = s.class_id and c.name = 'Primary 3'
where p.role = 'student'
on conflict (student_id, subject_id, term, session) do nothing;

-- 4. Three weeks of attendance
insert into attendance (student_id, class_id, day, status)
select p.id, c.id, d::date, 'present'
from profiles p
join classes c on c.name = 'Primary 3'
cross join generate_series(current_date - 20, current_date - 1, '1 day') d
where p.role = 'student'
on conflict (student_id, class_id, day) do nothing;

-- 5. Affective / psychomotor ratings and a class teacher remark
insert into student_evaluations (student_id, term, session, affective, psychomotor, teacher_remark)
select p.id, 'first', '2026/2027',
  '{"Responsibility":"Excellent","Politeness":"Very Good","Neatness":"Good","Attentiveness":"Very Good","Respect":"Excellent","Honesty":"Good","Confidence":"Good","Sociability":"Very Good"}',
  '{"Handwriting":"Very Good","Reading":"Excellent","Practical Skills":"Good","Physical Fitness":"Very Good"}',
  'A bright, curious learner who participates actively in class. Settles quickly and helps others.'
from profiles p
where p.role = 'student'
on conflict (student_id, term, session) do nothing;

-- 6. To add a second pupil (so the class has a ranking), create a user in
--    Supabase > Authentication > Users with role metadata "student", then re-run
--    this script — step 1 gives them a profile and step 2 enrols them.
