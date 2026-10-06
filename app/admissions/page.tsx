export default function Admissions() {
  return (
    <>
      <h1>Admissions</h1>
      <form method="post" action="/api/admissions">
        <input name="pupil_name" placeholder="Pupil name" required />
        <input name="entry_class" placeholder="Entry class" required />
        <input name="parent_contact" placeholder="Parent phone/email" required />
        <button type="submit">Submit inquiry</button>
      </form>
      <p>Turnstile + Postgres + ZeptoMail wired in P2.</p>
    </>
  );
}
