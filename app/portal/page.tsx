'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const links = [
  { href: '/portal/teacher', title: 'Gradebook', text: 'Enter continuous assessment scores for your classes.' },
  { href: '/portal/teacher/assignments', title: 'Assignments', text: 'Set work, review submissions and grade them.' },
  { href: '/portal/teacher/report', title: 'Report cards', text: 'Generate a branded terminal report for any pupil.' },
  { href: '/portal/admin', title: 'Admissions inbox', text: 'Review and track enquiries from the website.' },
];

export default function PortalHome() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.user.id).maybeSingle();
      setName(data?.full_name ?? '');
      setRole(data?.role ?? '');
    })();
  }, []);

  return (
    <div className="bg-slate-50 py-14">
      <div className="container-x">
        <span className="eyebrow">Portal</span>
        <h1 className="text-3xl sm:text-4xl">
          {name ? `Welcome, ${name.split(' ')[0]}` : 'Welcome'}
        </h1>
        <p className="mt-2 text-slate-600">Signed in as {role || 'guest'}.</p>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="card transition-transform hover:-translate-y-1">
              <h2 className="text-lg">{l.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{l.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
