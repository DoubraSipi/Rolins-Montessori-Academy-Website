import Link from 'next/link';

const pillars = [
  {
    title: 'Montessori Foundations',
    text: 'Our nursery blends the Montessori method with the Nigerian standard curriculum, so children learn through discovery before they learn through instruction.',
  },
  {
    title: 'Strong Academics',
    text: 'Literacy, numeracy and science taught by qualified teachers, with continuous assessment that tracks every child, not just the class.',
  },
  {
    title: 'Whole Child Growth',
    text: 'Behaviour, values and character are taught alongside books — through clubs, sports, worship and community service.',
  },
];

const stats = [
  { value: '15+', label: 'Years of service' },
  { value: '3', label: 'School sections' },
  { value: '40+', label: 'Trained educators' },
  { value: '600+', label: 'Families served' },
];

const programs = [
  {
    tag: 'Ages 2–5',
    title: 'Nursery',
    text: 'Montessori-inspired learning through play, sensorial exploration and early literacy.',
    href: '/academics#nursery',
  },
  {
    tag: 'Ages 5–11',
    title: 'Primary',
    text: 'Strong literacy and numeracy foundations with continuous assessment from Year 1.',
    href: '/academics#primary',
  },
  {
    tag: 'Ages 11–17',
    title: 'Secondary',
    text: 'WAEC, NECO and BECE preparation with science, commercial and arts pathways.',
    href: '/academics#secondary',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #2f97d4 0, transparent 45%), radial-gradient(circle at 80% 10%, #dfa128 0, transparent 40%)',
          }}
        />
        <div className="container-x relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="eyebrow bg-white/10 text-gold-300">Alakahia, Port Harcourt</span>
            <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Learning that grows
              <span className="block text-gold-300">confident children.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/85">
              Rolins Montessori Academy combines Montessori foundations with the Nigerian standard
              curriculum across nursery, primary and secondary — for children who learn best by
              doing, and parents who expect real progress.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/admissions" className="btn bg-gold-500 text-brand-900 hover:bg-gold-300">
                Apply for Admission
              </Link>
              <Link
                href="/academics"
                className="btn border-2 border-white/40 text-white hover:bg-white hover:text-brand-900"
              >
                Explore Academics
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 self-center">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <dt className="font-display text-4xl font-semibold text-white">{s.value}</dt>
                <dd className="mt-1 text-sm text-brand-100/75">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Pillars */}
      <section className="section bg-white">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Why Rolins</span>
            <h2 className="text-3xl sm:text-4xl">Three things every parent asks</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.title} className="card">
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="eyebrow">Programs</span>
              <h2 className="text-3xl sm:text-4xl">A clear path from ages 2 to 17</h2>
            </div>
            <Link href="/academics" className="text-sm font-semibold text-brand-700 hover:text-brand-500">
              View all programs →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {programs.map((p) => (
              <Link key={p.title} href={p.href} className="card transition-transform hover:-translate-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-700">{p.tag}</span>
                <h3 className="mt-2 text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{p.text}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-brand-700">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-800">
        <div className="container-x flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl text-3xl text-white sm:text-4xl">
            Come and see the school before you decide.
          </h2>
          <p className="max-w-xl text-brand-100/80">
            Book a guided tour of our classrooms, meet the teachers, and watch a lesson in progress.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn bg-white text-brand-900 hover:bg-brand-50">
              Book a Tour
            </Link>
            <Link
              href="/admissions"
              className="btn border-2 border-white/40 text-white hover:bg-white hover:text-brand-900"
            >
              Start an Application
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
