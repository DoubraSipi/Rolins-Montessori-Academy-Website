import Image from 'next/image';

export type SubjectScore = {
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
};

export type ReportData = {
  studentName: string;
  className: string;
  term: string;
  session: string;
  position: string;
  total: number;
  average: number;
  attendance: { present: number; absent: number; total: number };
  subjects: SubjectScore[];
  affective: Record<string, string>;
  psychomotor: Record<string, string>;
  teacherRemark: string;
};

const CA1_MAX = 30;
const CA2_MAX = 30;
const EXAM_MAX = 40;

export function gradeFor(total: number): string {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 40) return 'D';
  if (total >= 35) return 'E';
  return 'F';
}

export function remarkFor(grade: string): string {
  switch (grade) {
    case 'A': return 'Excellent';
    case 'B': return 'Very Good';
    case 'C': return 'Good';
    case 'D': return 'Fair';
    case 'E': return 'Poor';
    default: return 'Fail';
  }
}

const AFFECTIVE_DEFAULT = ['Responsibility', 'Politeness', 'Neatness', 'Attentiveness', 'Respect', 'Honesty', 'Confidence', 'Sociability'];
const PSYCHOMOTOR_DEFAULT = ['Handwriting', 'Reading', 'Practical Skills', 'Physical Fitness'];

export function ReportSheet({ data }: { data: ReportData }) {
  const affectiveKeys = Object.keys(data.affective).length ? Object.keys(data.affective) : AFFECTIVE_DEFAULT;
  const psychomotorKeys = Object.keys(data.psychomotor).length ? Object.keys(data.psychomotor) : PSYCHOMOTOR_DEFAULT;

  return (
    <div className="report-sheet mx-auto max-w-4xl bg-white p-8 text-slate-900 shadow-card print:p-0 print:shadow-none">
      <header className="flex items-start gap-5 border-b-2 border-brand-800 pb-5">
        <Image src="/logo.png" alt="School crest" width={88} height={88} className="h-22 w-22 object-contain" style={{ width: 88, height: 88 }} />
        <div className="flex-1 text-center">
          <h1 className="font-display text-2xl leading-tight text-brand-900 sm:text-3xl">
            ROLINS MONTESSORI ACADEMY LTD
          </h1>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-600">
            Rumuologu Road / UPTH Junction, Alakahia, Obio/Akpor, Port Harcourt
          </p>
          <p className="mt-1 text-[11px] text-slate-500">RC 1276137 · Motto: Limitless Opportunities</p>
        </div>
        <div className="hidden w-28 shrink-0 text-right sm:block">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Report for</p>
          <p className="font-display text-lg text-crimson-600">{data.term}</p>
          <p className="text-xs text-slate-600">{data.session}</p>
        </div>
      </header>

      <h2 className="mt-5 text-center font-display text-xl uppercase tracking-[0.2em] text-brand-800">
        Terminal Report
      </h2>

      <table className="mt-5 w-full border-collapse text-sm">
        <tbody>
          <tr>
            <th className="w-32 border border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold">Pupil</th>
            <td className="border border-slate-300 px-3 py-2">{data.studentName}</td>
            <th className="w-28 border border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold">Class</th>
            <td className="border border-slate-300 px-3 py-2">{data.className}</td>
          </tr>
          <tr>
            <th className="border border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold">Position</th>
            <td className="border border-slate-300 px-3 py-2 font-semibold text-brand-800">{data.position}</td>
            <th className="border border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold">Total / Average</th>
            <td className="border border-slate-300 px-3 py-2">
              {data.total} / {data.average}
            </td>
          </tr>
          <tr>
            <th className="border border-slate-300 bg-slate-50 px-3 py-2 text-left font-semibold">Attendance</th>
            <td className="border border-slate-300 px-3 py-2" colSpan={3}>
              {data.attendance.present} present · {data.attendance.absent} absent · {data.attendance.total} school days
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-brand-800">Subject Performance</h3>
      <table className="mt-2 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-800 text-white">
            <th className="border border-brand-800 px-3 py-2 text-left">Subject</th>
            <th className="border border-brand-800 px-2 py-2">CA1 / {CA1_MAX}</th>
            <th className="border border-brand-800 px-2 py-2">CA2 / {CA2_MAX}</th>
            <th className="border border-brand-800 px-2 py-2">Exam / {EXAM_MAX}</th>
            <th className="border border-brand-800 px-2 py-2">Total / 100</th>
            <th className="border border-brand-800 px-2 py-2">Grade</th>
            <th className="border border-brand-800 px-3 py-2 text-left">Remark</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((s) => (
            <tr key={s.subject} className="odd:bg-slate-50">
              <td className="border border-slate-300 px-3 py-2">{s.subject}</td>
              <td className="border border-slate-300 px-2 py-2 text-center">{s.ca1}</td>
              <td className="border border-slate-300 px-2 py-2 text-center">{s.ca2}</td>
              <td className="border border-slate-300 px-2 py-2 text-center">{s.exam}</td>
              <td className="border border-slate-300 px-2 py-2 text-center font-semibold">{s.total}</td>
              <td className="border border-slate-300 px-2 py-2 text-center font-semibold">{s.grade}</td>
              <td className="border border-slate-300 px-3 py-2">{s.remark}</td>
            </tr>
          ))}
          {data.subjects.length === 0 && (
            <tr>
              <td colSpan={7} className="border border-slate-300 px-3 py-4 text-center text-slate-500">
                No scores recorded for this term.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-800">Affective Traits</h3>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {affectiveKeys.map((k) => (
                <tr key={k} className="odd:bg-slate-50">
                  <td className="border border-slate-300 px-3 py-1.5">{k}</td>
                  <td className="border border-slate-300 px-3 py-1.5 text-center font-medium">
                    {data.affective[k] || 'Good'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-800">Psychomotor Skills</h3>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {psychomotorKeys.map((k) => (
                <tr key={k} className="odd:bg-slate-50">
                  <td className="border border-slate-300 px-3 py-1.5">{k}</td>
                  <td className="border border-slate-300 px-3 py-1.5 text-center font-medium">
                    {data.psychomotor[k] || 'Good'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-7 rounded-lg border border-slate-300 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-800">Class Teacher&apos;s Remark</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
          {data.teacherRemark || 'No remark recorded yet.'}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
        {['Class Teacher', 'Head of School', 'Proprietress'].map((s) => (
          <div key={s}>
            <div className="h-12 border-b border-slate-400" />
            <p className="mt-2 font-semibold">{s}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] uppercase tracking-wider text-slate-400">
        Rolins Montessori Academy LTD · This report is computer generated and valid with authorised signatures.
      </p>
    </div>
  );
}
