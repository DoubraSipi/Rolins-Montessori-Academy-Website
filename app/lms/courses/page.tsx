'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Course = { id: string; title: string; description: string | null };
type Lesson = { id: string; course_id: string; title: string };

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    (async () => {
      const { data: c, error } = await supabase.from('lms_courses').select('*');
      if (error) { setMsg(error.message); return; }
      setCourses(c ?? []);
      const { data: l } = await supabase.from('lms_lessons').select('*');
      setLessons(l ?? []);
      setMsg('');
    })();
  }, []);

  return (
    <>
      <h1>Courses</h1>
      <p>{msg}</p>
      {courses.map((c) => (
        <div key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <ul>{lessons.filter((l) => l.course_id === c.id).map((l) => <li key={l.id}>{l.title}</li>)}</ul>
        </div>
      ))}
    </>
  );
}
