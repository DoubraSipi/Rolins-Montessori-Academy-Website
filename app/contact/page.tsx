import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <>
      <section className="bg-brand-900 py-20">
        <div className="container-x">
          <span className="eyebrow bg-white/10 text-gold-300">Contact</span>
          <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">
            Come and see us.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/85">
            We are on Rumuologu Road, a few minutes from the UPTH junction in Alakahia. The school
            office is open Monday to Friday, 8am – 4pm.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          {[
            { title: 'Visit', lines: ['Rumuologu Road / UPTH Junction', 'Alakahia, Obio/Akpor', 'Port Harcourt, Rivers State'] },
            { title: 'Call', lines: ['+234 800 000 0000', 'Office hours: Mon – Fri, 8am – 4pm'] },
            { title: 'Email', lines: ['admissions@rolinsmontessori.edu.ng', 'info@rolinsmontessori.edu.ng'] },
          ].map((c) => (
            <div key={c.title} className="card">
              <h2 className="text-xl">{c.title}</h2>
              <ul className="mt-3 space-y-1.5 text-slate-600">
                {c.lines.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-x mt-12 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
            <iframe
              title="Map of Rolins Montessori Academy location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=7.03%2C4.79%2C7.09%2C4.83&layer=mapnik&marker=4.81%2C7.06"
              className="h-80 w-full"
              loading="lazy"
            />
          </div>

          <div className="card">
            <h2 className="text-2xl">Book a tour</h2>
            <p className="mt-2 text-slate-600">
              Send an enquiry and we will arrange a time that suits you. Tours run on weekdays
              during school hours.
            </p>
            <Link href="/admissions" className="btn-primary mt-6">
              Start an Enquiry
            </Link>
            <p className="mt-6 border-t border-slate-200 pt-5 text-sm leading-relaxed text-slate-500">
              RC 1276137 · Rolins Montessori Academy LTD · Rumuologu Road, Alakahia, Port Harcourt.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
