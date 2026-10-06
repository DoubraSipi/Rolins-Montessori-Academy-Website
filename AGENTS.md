# Rolins Montessori Academy — OpenCode instructions
- Stack: Next.js App Router + TypeScript, Supabase Postgres + Auth + RLS, Cloudflare Pages + Functions + R2, ZeptoMail for transactional email.
- Constraints: Cloudflare Pages-compatible. No Node-only APIs in `functions/`. Files via R2 presigned URLs. Email only via Workers + ZeptoMail.
- Routes: `/`, `/about`, `/academics`, `/admissions`, `/contact`, `/auth/login`, `/portal/teacher`, `/portal/student`, `/portal/admin`, `/lms/courses/[id]`.
