'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Row = {
  student_id: string;
  student_name: string;
  subject_id: string;
  ca1_score: number;
  ca2_score: number;
  exam_score: number;
};

export default function Gradebook() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { setMsg('Sign in first.'); return; }
      const { data: subjects } = await supabase.from('subjects').select('id').eq('teacher_id', user.user.id);
      if (!subjects?.length) { setMsg('No subjects assigned.'); return; }
      const { data: grades, error } = await supabase.from('grades').select('*').in('subject_id', subjects.map((s) => s.id));
      if (error) { setMsg(error.message); return; }
      setRows((grades ?? []) as Row[]);
      setMsg('');
    })();
  }, []);

  function total(r: Row) { return Number(r.ca1_score) + Number(r.ca2_score) + Number(r.exam_score); }
  function grade(r: Row) {
    const t = total(r);
    return t >= 70 ? 'A' : t >= 60 ? 'B' : t >= 50 ? 'C' : t >= 40 ? 'D' : 'F';
  }

  async function save(r: Row) {
    setMsg('Saving...');
    const { error } = await supabase.from('grades').upsert({
      student_id: r.student_id,
      subject_id: r.subject_id,
      term: 'first',
      session: '2026/2027',
      ca1_score: r.ca1_score,
      ca2_score: r.ca2_score,
      exam_score: r.exam_score,
    }, { onConflict: 'student_id,subject_id,term,session' });
    setMsg(error ? error.message : 'Saved.');
  }

  return (
    <>
      <h1>Teacher gradebook</h1>
      <p>{msg}</p>
      <table>
        <thead><tr><th>Student</th><th>CA1</th><th>CA2</th><th>Exam</th><th>Total</th><th>Grade</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.student_id + r.subject_id}>
              <td>{r.student_name || r.student_id.slice(0, 8)}</td>
              <td><input type="number" value={r.ca1_score} onChange={(e) => setRows(rows.map((x) => x === r ? { ...r, ca1_score: Number(e.target.value) } : x))} /></td>
              <td><input type="number" value={r.ca2_score} onChange={(e) => setRows(rows.map((x) => x === r ? { ...r, ca2_score: Number(e.target.value) } : x))} /></td>
              <td><input type="number" value={r.exam_score} onChange={(e) => setRows(rows.map((x) => x === r ? { ...r, exam_score: Number(e.target.value) } : x))} /></td>
              <td>{total(r)}</td>
              <td>{grade(r)}</td>
              <td><button onClick={() => save(r)}>Save</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
