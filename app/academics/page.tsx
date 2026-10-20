import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Academics' };

const sections = [
  {
    id: 'nursery',
    tag: 'Ages 2–5',
    title: 'Nursery School',
    lead: 'Montessori-inspired learning through play, sensorial exploration and early literacy.',
    points: [
      'Prepared environment with self-correcting learning materials',
      'Sensorial, practical life, language and number work',
      'Daily outdoor play, story time and circle time',
      'Progress tracked through observation, not examinations',
    ],
  },
  {
    id: 'primary',
    tag: 'Ages 5–11',
    title: 'Primary School',
    lead: 'Strong literacy and numeracy foundations built for the standard curriculum.',
    points: [
      'Reading fluency, writing skills and mathematical reasoning',
      'Basic science, social studies and creative arts',
      'Continuous assessment with termly progress reports',
      'ICT introduction, library and guided reading time',
    ],
  },
  {
    id: 'secondary',
    tag: 'Ages 11–17',
    title: 'Secondary School',
    lead: 'WAEC, NECO and BECE preparation with clear pathways for every student.',
    points: [
      'Junior and senior secondary science, commercial and arts streams',
      'Exam-focused tutoring in Mathematics, English and Sciences',
      'Practical laboratory work and supervised projects',
      'Career guidance, leadership and community service',
    ],
  },
];

const extras = [
  { title: 'Clubs & Societies', text: 'Debate, drama, coding, home economics and environmental club.' },
  { title: 'Sports & Athletics', text: 'Football, athletics, volleyball and inter-house competitions.' },
  { title: 'Devotional Life', text: 'Morning devotion, Bible study and character development.' },
  { title: 'ICT & Digital Literacy', text: 'Computer fundamentals and digital safety from primary upward.' },
];

export default function Academics() {
  return (
    <>
      <section className="bg-brand-900 py-20">
        <div className="container-x">
          <span className="eyebrow bg-white/10 text-gold-300">Academics</span>
          <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">
            A curriculum that grows with the child.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/85">
            Montessori foundations in the nursery, the standard Nigerian curriculum from primary
            upward, and continuous assessment that tells you exactly where your child stands.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x space-y-16">
          {sections.map((s, i) => (
            <article key={s.id} id={s.id} className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="eyebrow">{s.tag}</span>
                <h2 className="text-3xl sm:text-4xl">{s.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{s.lead}</p>
              </div>
              <ul className={`space-y-3 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="text-slate-700">{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Beyond the classroom</span>
            <h2 className="text-3xl sm:text-4xl">Clubs, sports and character</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {extras.map((e) => (
              <article key={e.title} className="card">
                <h3 className="text-lg">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-800 py-16">
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <h2 className="text-3xl text-white">Not sure which section fits your child?</h2>
          <p className="max-w-xl text-brand-100/80">
            Send us your child&apos;s age and we will advise on placement — and on what to expect in
            the first term.
          </p>
          <Link href="/admissions" className="btn bg-gold-500 text-brand-900 hover:bg-gold-300">
            Start an Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
