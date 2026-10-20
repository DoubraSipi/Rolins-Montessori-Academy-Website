'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const steps = [
  { n: '01', title: 'Send an enquiry', text: 'Tell us your child’s name, the class you are applying for and how to reach you.' },
  { n: '02', title: 'Come for a tour', text: 'Walk the classrooms, meet the teachers and see a lesson in progress.' },
  { n: '03', title: 'Collect the form', text: 'Pick up the admission form at the school office or ask us to send it to you.' },
  { n: '04', title: 'Submit & confirm', text: 'Return the completed form with supporting documents. We confirm your child’s place.' },
];

export default function Admissions() {
  const [pupil, setPupil] = useState('');
  const [entryClass, setEntryClass] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Submitting...');
    setOk(false);
    const { error } = await supabase.from('admissions').insert({
      pupil_name: pupil,
      entry_class: entryClass,
      parent_contact: contact,
    });
    if (error) { setMsg(error.message); return; }
    setMsg('Received. The school office will contact you shortly.');
    setOk(true);
    setPupil(''); setEntryClass(''); setContact('');
  }

  return (
    <>
      <section className="bg-brand-900 py-20">
        <div className="container-x">
          <span className="eyebrow bg-white/10 text-gold-300">Admissions</span>
          <h1 className="max-w-3xl text-4xl text-white sm:text-5xl">
            Give your child a head start.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/85">
            We admit a limited number of pupils each term so every class stays small and supported.
            Start with an enquiry — it takes a minute.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="eyebrow">Enquiry form</span>
            <h2 className="text-3xl sm:text-4xl">Tell us about your child</h2>
            <p className="mt-3 text-slate-600">
              No payment required at this stage. A member of the school office will contact you
              to arrange a tour.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="pupil">
                  Pupil&apos;s name
                </label>
                <input
                  id="pupil"
                  value={pupil}
                  onChange={(e) => setPupil(e.target.value)}
                  required
                  placeholder="e.g. Ada Okonkwo"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="entry">
                  Entry class
                </label>
                <input
                  id="entry"
                  value={entryClass}
                  onChange={(e) => setEntryClass(e.target.value)}
                  required
                  placeholder="e.g. Primary 1 or Nursery 2"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="contact">
                  Parent phone or email
                </label>
                <input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  placeholder="0803 000 0000 or name@email.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
                />
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                Submit Enquiry
              </button>

              {msg && (
                <p className={`rounded-xl px-4 py-3 text-sm ${ok ? 'bg-brand-50 text-brand-800' : 'bg-amber-50 text-amber-800'}`}>
                  {msg}
                </p>
              )}
            </form>
          </div>

          <aside className="lg:col-span-2">
            <div className="card bg-brand-50">
              <h3 className="text-xl">How admission works</h3>
              <ol className="mt-6 space-y-6">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-semibold text-gold-300">
                      {s.n}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-900">{s.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 card">
              <h3 className="text-lg">Age guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><strong className="text-brand-800">Nursery 1</strong> — 2½ to 3½ years</li>
                <li><strong className="text-brand-800">Nursery 2</strong> — 3½ to 4½ years</li>
                <li><strong className="text-brand-800">Primary 1</strong> — 5 years and above</li>
                <li><strong className="text-brand-800">JSS 1</strong> — 11 years and above</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
