'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Admissions() {
  const [pupil, setPupil] = useState('');
  const [entryClass, setEntryClass] = useState('');
  const [contact, setContact] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('Submitting...');
    const { error } = await supabase.from('admissions').insert({
      pupil_name: pupil,
      entry_class: entryClass,
      parent_contact: contact,
    });
    setMsg(error ? error.message : 'Received. The school will contact you.');
    if (!error) { setPupil(''); setEntryClass(''); setContact(''); }
  }

  return (
    <>
      <h1>Admissions</h1>
      <form onSubmit={submit}>
        <input placeholder="Pupil name" value={pupil} onChange={(e) => setPupil(e.target.value)} required />
        <input placeholder="Entry class" value={entryClass} onChange={(e) => setEntryClass(e.target.value)} required />
        <input placeholder="Parent phone/email" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <button type="submit">Submit inquiry</button>
      </form>
      <p>{msg}</p>
    </>
  );
}
