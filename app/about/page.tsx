import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

const values = [
  {
    title: 'Childhood before curriculum',
    text: 'We protect play, wonder and rest. A child who feels safe and curious learns faster than one who is merely being taught.',
  },
  {
    title: 'Character alongside grades',
    text: 'Honesty, respect and responsibility are taught deliberately — through worship, community service and classroom routines.',
  },
  {
    title: 'Accountability to parents',
    text: 'Continuous assessment means you always know where your child stands, term by term, not only at the end of the year.',
  },
];

export default function About() {
  return (
    <>
      <section className="bg-brand-900 py-20">
        <div className="container-x">
          <span className="eyebrow bg-white/10 text-gold-300">About us</span>
          <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">
            A school built on the idea that every child can flourish.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/85">
            Rolins Montessori Academy LTD (RC 1276137) has been serving families in Alakahia,
            Port Harcourt for over fifteen years — combining Montessori foundations with the Nigerian
            standard curriculum.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div className="prose-x">
            <span className="eyebrow">Our story</span>
            <h2 className="text-3xl sm:text-4xl">From one classroom to three schools</h2>
            <p>
              We began with a simple conviction: children learn best when they are trusted, when
              they are given room to explore, and when the adults guiding them know them well.
            </p>
            <p>
              What started as a single nursery classroom on Rumuologu Road grew into a full
              institution serving nursery, primary and secondary learners — without ever losing the
              warmth that made it special.
            </p>
            <p>
              Today our educators hold the Nigerian teaching qualification, our classrooms follow
              the standard curriculum, and our reporting is continuous — so parents see progress
              as it happens rather than in surprise at the end of a term.
            </p>
          </div>

          <div className="space-y-5">
            {values.map((v) => (
              <article key={v.title} className="card">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Leadership</span>
            <h2 className="text-3xl sm:text-4xl">The people in your child&apos;s corner</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Proprietress', role: 'School Leader', note: 'Oversees vision, standards and staff development.' },
              { name: 'Head of School', role: 'Academic Lead', note: 'Curriculum planning, assessment design and staff coaching.' },
              { name: 'Section Heads', role: 'Nursery / Primary / Secondary', note: 'Daily classroom leadership and parent contact.' },
            ].map((p) => (
              <article key={p.name} className="card text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 font-display text-2xl font-semibold text-brand-800">
                  {p.name.slice(0, 1)}
                </div>
                <h3 className="mt-4 text-lg">{p.name}</h3>
                <p className="text-sm font-semibold uppercase tracking-wide text-gold-700">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
