'use client';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ReportSheet, gradeFor, remarkFor, type ReportData, type SubjectScore } from '@/components/ReportSheet';

type ClassRow = { id: string; name: string; section: string };
type StudentRow = { id: string; full_name: string };
type GradeRow = {
  student_id: string;
  subject_id: string;
  ca1_score: number;
  ca2_score: number;
  exam_score: number;
};

const TERM = 'first';
const SESSION = '2026/2027';
const RATINGS = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
const AFFECTIVE = ['Responsibility', 'Politeness', 'Neatness', 'Attentiveness', 'Respect', 'Honesty', 'Confidence', 'Sociability'];
const PSYCHOMOTOR = ['Handwriting', 'Reading', 'Practical Skills', 'Physical Fitness'];

export default function ReportGenerator() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [classId, setClassId] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { setMsg('Sign in first.'); return; }
      const { data: subjects } = await supabase
        .from('subjects')
        .select('class_id, classes(id, name, section)')
        .eq('teacher_id', user.user.id);
      const seen = new Map<string, ClassRow>();
      for (const s of subjects ?? []) {
        const joined = (s as unknown as { classes: ClassRow | ClassRow[] | null }).classes;
        const c = Array.isArray(joined) ? joined[0] : joined;
        if (c && !seen.has(c.id)) seen.set(c.id, c);
      }
      const list = Array.from(seen.values());
      setClasses(list);
      if (list.length) setClassId(list[0].id);
      setMsg(list.length ? '' : 'No classes assigned to you.');
    })();
  }, []);

  useEffect(() => {
    if (!classId) return;
    (async () => {
      const { data: enr } = await supabase.from('enrollments').select('student_id').eq('class_id', classId);
      const ids = (enr ?? []).map((e) => e.student_id);
      if (!ids.length) { setStudents([]); return; }
      const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', ids);
      setStudents((profs ?? []) as StudentRow[]);
    })();
  }, [classId]);

  const buildReport = useCallback(
    async (sid: string) => {
      setMsg('Building report...');
      const { data: subjects } = await supabase.from('subjects').select('id, name').eq('class_id', classId);
      const subjectIds = (subjects ?? []).map((s) => s.id);

      const { data: allGrades } = subjectIds.length
        ? await supabase.from('grades').select('*').in('subject_id', subjectIds).eq('term', TERM).eq('session', SESSION)
        : { data: [] as GradeRow[] };

      const grades = (allGrades ?? []) as GradeRow[];
      const { data: enrollments } = await supabase.from('enrollments').select('student_id').eq('class_id', classId);
      const classStudentIds = (enrollments ?? []).map((e) => e.student_id);

      const sumFor = (student: string) =>
        grades
          .filter((g) => g.student_id === student)
          .reduce((sum, g) => sum + Number(g.ca1_score) + Number(g.ca2_score) + Number(g.exam_score), 0);

      const ranked = classStudentIds
        .map((id) => ({ id, total: sumFor(id) }))
        .sort((a, b) => b.total - a.total);
      const posIndex = ranked.findIndex((r) => r.id === sid);
      const position = posIndex >= 0 ? `${posIndex + 1} of ${ranked.length}` : '—';

      const myGrades = grades.filter((g) => g.student_id === sid);
      const rows: SubjectScore[] = (subjects ?? []).map((s) => {
        const g = myGrades.find((x) => x.subject_id === s.id);
        const ca1 = Number(g?.ca1_score ?? 0);
        const ca2 = Number(g?.ca2_score ?? 0);
        const exam = Number(g?.exam_score ?? 0);
        const total = ca1 + ca2 + exam;
        const grade = gradeFor(total);
        return { subject: s.name, ca1, ca2, exam, total, grade, remark: remarkFor(grade) };
      });

      const { data: att } = await supabase.from('attendance').select('status').eq('student_id', sid);
      const attendanceRows = (att ?? []) as { status: string }[];
      const present = attendanceRows.filter((a) => a.status === 'present' || a.status === 'late').length;

      const { data: evals } = await supabase
        .from('student_evaluations')
        .select('*')
        .eq('student_id', sid)
        .eq('term', TERM)
        .eq('session', SESSION)
        .maybeSingle();

      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', sid).maybeSingle();
      const cls = classes.find((c) => c.id === classId);

      const total = rows.reduce((s, r) => s + r.total, 0);
      const average = rows.length ? Math.round((total / rows.length) * 10) / 10 : 0;

      setReport({
        studentName: prof?.full_name ?? 'Pupil',
        className: cls?.name ?? '',
        term: TERM,
        session: SESSION,
        position,
        total,
        average,
        attendance: { present, absent: Math.max(0, attendanceRows.length - present), total: attendanceRows.length },
        subjects: rows,
        affective: (evals?.affective as Record<string, string>) ?? {},
        psychomotor: (evals?.psychomotor as Record<string, string>) ?? {},
        teacherRemark: evals?.teacher_remark ?? '',
      });
      setMsg('');
    },
    [classId, classes]
  );

  async function saveEvaluation(affective: Record<string, string>, psychomotor: Record<string, string>, remark: string) {
    const { error } = await supabase.from('student_evaluations').upsert(
      { student_id: studentId, term: TERM, session: SESSION, affective, psychomotor, teacher_remark: remark },
      { onConflict: 'student_id,term,session' }
    );
    setMsg(error ? error.message : 'Evaluation saved.');
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="container-x">
        <span className="eyebrow">Reports</span>
        <h1 className="text-3xl sm:text-4xl">Generate a report card</h1>
        <p className="mt-2 text-slate-600">
          Pick a class and a pupil. Use Print → Save as PDF to produce a signed report.
        </p>

        <div className="mt-7 flex flex-wrap items-end gap-4">
          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-slate-700">Class</span>
            <select
              value={classId}
              onChange={(e) => { setClassId(e.target.value); setReport(null); }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-brand-600"
            >
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block font-semibold text-slate-700">Pupil</span>
            <select
              value={studentId}
              onChange={(e) => { setStudentId(e.target.value); setReport(null); if (e.target.value) buildReport(e.target.value); }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-brand-600"
            >
              <option value="">Select a pupil…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </label>

          {report && (
            <button onClick={() => window.print()} className="btn-primary">
              Print / Save as PDF
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600">{msg}</p>

        {report && (
          <div className="mt-8">
            <ReportSheet data={report} />
          </div>
        )}

        {report && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-xl">Traits &amp; remark</h2>
            <p className="mt-1 text-sm text-slate-600">These fill the affective and psychomotor grids on the report.</p>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {(['affective', 'psychomotor'] as const).map((group) => (
                <div key={group}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-800">
                    {group === 'affective' ? 'Affective traits' : 'Psychomotor skills'}
                  </h3>
                  <div className="space-y-2">
                    {(group === 'affective' ? AFFECTIVE : PSYCHOMOTOR).map((k) => (
                      <label key={k} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                        <span className="text-sm text-slate-700">{k}</span>
                        <select
                          value={report[group][k] || 'Good'}
                          onChange={(e) => {
                            const next = { ...report, [group]: { ...report[group], [k]: e.target.value } };
                            setReport(next);
                            saveEvaluation(next.affective, next.psychomotor, next.teacherRemark);
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm"
                        >
                          {RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <label className="mt-6 block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Class teacher&apos;s remark</span>
              <textarea
                rows={3}
                defaultValue={report.teacherRemark}
                onBlur={(e) => saveEvaluation(report.affective, report.psychomotor, e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
