# Implementation Plan — Rolins Montessori Academy Website
Free-tier only. Stack locked: Postgres + Cloudflare + ZeptoMail.

## 0. Free-tier budgets (verified Oct 2026)
- **Postgres — Supabase Free (primary):** 500MB DB, 1GB storage, 5GB egress/mo, 50k MAU, 2 projects, pauses after 7d inactivity (10-30s cold start). Use for Auth + RLS + Postgres.
  Alt: **Neon Free** — 0.5GB/project, 100 CU-hrs/project/mo, 100 projects, scale-to-zero after 5min, no 7-day pause. Switch if pausing hurts demo.
- **Cloudflare Free:** Pages 500 builds/mo, 20k files, 25MB/file, unlimited static requests. Pages Functions = Workers free: 100k req/day, 10ms CPU/req. R2: 10GB-month, 1M Class A / 10M Class B per mo, zero egress. Turnstile (captcha), DNS, 100 custom domains/project free.
- **ZeptoMail (now Zoho CPaaS Email):** 1st credit free = 10k emails / 1 month. Then ~$2.50 per 10k, valid 6 months, pay-as-you-go. Transactional-only via SMTP/API (`api.zeptomail.com/v1.1/email`, `Zoho-enczapikey` header). Logs retained 60 days.

Rule: stay inside these quotas. No paid upgrade until school adoption.

## 1. Architecture
```
Browser
  ├─ Cloudflare Pages (Next.js static + ISR) — public site
  ├─ Cloudflare Workers / Pages Functions (/api/*) — thin proxy
  │    ├─ Postgres (Supabase, via Supavisor pooled connection + Hyperdrive)
  │    ├─ R2 (homework uploads, report PDFs, galleries) via presigned URLs
  │    └─ ZeptoMail API (admissions receipt, reset, report-ready notices)
  └─ Cloudflare Turnstile on all public forms
```
- Next.js App Router, TypeScript. Public pages statically exported where possible; dashboards client-rendered to stay under Workers CPU limits.
- Auth: Supabase Auth (email + Turnstile). Roles in `profiles.role`: `admin|teacher|student|parent`.
- Files: never through Workers (10ms CPU). Browser ↔ R2 presigned URL direct. Workers only mint URLs + validate RLS.
- Email: only Workers call ZeptoMail (key stays server-side). Templates: admission-received, user-invite, password-reset, report-published.

## 2. Repo layout (in this folder)
```
/app/(public)/page|about|academics|admissions|contact
/app/auth/login
/app/portal/teacher|student|admin
/app/lms/courses/[id]
/functions/api/* (Cloudflare Pages Functions — ZeptoMail + R2 sign + report trigger)
/supabase/migrations/*.sql
/emails/*.html (ZeptoMail templates)
/wrangler.toml, next.config.js
```

## 3. Postgres schema (Supabase migration 001)
`profiles(id FK auth.users, full_name, role, phone)`, `classes(id, name, section)`, `subjects(id, class_id, teacher_id)`, `enrollments(student_id, class_id, session)`, `lms_courses`, `lms_lessons`, `lms_assignments(id, subject_id, title, due_date, max_points)`, `lms_submissions(id, assignment_id, student_id, r2_key, score, feedback)`, `grades(student_id, subject_id, term, session, ca1, ca2, exam)`, `reports(student_id, term, session, r2_key)`, `admissions(id, pupil_name, entry_class, parent_contact, status)`.
RLS: teachers write `grades/submissions` only for own `subjects.teacher_id`; students read own enrollments; parents read linked student via `parent_links`.

## 4. Cloudflare setup (free)
1. Pages project ← GitHub `DoubraSipi/Rolins-Montessori-Academy-Website`, framework Next.js, env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `R2_*`, `ZEPTOMAIL_TOKEN` (secret only in Functions).
2. R2 buckets: `rolins-uploads` (homework), `rolins-reports` (PDFs), `rolins-media` (gallery). Public bucket only for `media`; others private + presigned 15min.
3. Custom domain later: `rolinsmontessori.sch.ng` via Cloudflare DNS. Keep `*.pages.dev` for prototype.
4. Turnstile widget on `/admissions`, `/contact`, `/auth/login`.

## 5. ZeptoMail setup (free credit)
1. Signup → verify domain (SPF/DKIM via Cloudflare DNS) → create Mail Agent `rolins-transactional` → SMTP + API token.
2. 4 templates (plain HTML, no tracking pixels): admission receipt, invite, reset, report ready.
3. Rate guard: queue in `email_outbox` Postgres table; Worker cron (free) drains 50/min to stay in quota.
4. Prototype uses free 10k; monitor Dashboard → Subscription (expiry 1 month).

## 6. Build phases (OpenCode prompts)
- **P0 scaffold:** "Scaffold Next.js App Router + TS + Tailwind + Shadcn in current folder with routes `/, /about, /academics, /admissions, /contact, /auth/login, /portal/teacher, /lms/courses/[id]`. Add `wrangler.toml` + `functions/api/health.ts`. Cloudflare Pages-compatible (no Node-only APIs in Functions)."
- **P1 DB:** "Write `supabase/migrations/001_init.sql` for tables above with FKs + RLS as specified. Include seed: 1 admin, 2 teachers, 1 class each section."
- **P2 public + admissions:** "Build public pages + admissions form (Turnstile) → POST `functions/api/admissions` → Postgres `admissions` + ZeptoMail receipt via `email_outbox`."
- **P3 teacher gradebook:** "Editable table CA1/CA2/Exam, live total/grade, save to `grades`. Broadsheet view per class. RLS-enforced."
- **P4 LMS:** "Assignment create → R2 presigned upload → submission row → inline grade/feedback. Lessons list with R2/PDF links."
- **P5 reports:** "Worker `functions/api/reports/generate?student=&term=` fetches grades+attendance, renders PDF with `@react-pdf/renderer` (keep <10ms CPU or render client-side and upload to R2), stores `r2_key` in `reports`, sends ZeptoMail notice."
- **P6 harden/demo:** Turnstile everywhere, R2 lifecycle (delete drafts 90d), backup `pg_dump` weekly to R2, Pages preview demo script.

## 7. What stays out (free-tier discipline)
No realtime subscriptions (200 conn cap), no large PDFs via Functions (use client render + R2 upload), no marketing mail via ZeptoMail (transactional only — blocked otherwise), no >25MB assets on Pages (use R2).

## 8. Cost on adoption
$0 prototype. Later: Supabase Pro $25/mo (no pause) OR Neon pay-as-you-go, Cloudflare stays free, ZeptoMail ~$2.50/10k/6mo, domain ~₦5-15k/yr.

## 9. Acceptance (demo day)
1. Submit admission → row in admin + ZeptoMail receipt in inbox.
2. Teacher uploads lesson → student downloads + submits homework → teacher grades.
3. Enter CA1/CA2/Exam → Generate Report → branded PDF downloads + parent email.
4. All on `*.pages.dev` inside free quotas (show Cloudflare + Supabase dashboards).
