# Rolins Montessori Academy — Integrated Digital Platform

Source: Gemini export `Building Rolins Montessori Website` (9 pages, 2026-10-06)
Target org: Rolins Montessori Academy LTD (RC: 1276137), Rumuologu Road / UPTH Junction, Alakahia, Obio/Akpor, Port Harcourt.

## Vision
Unified platform combining public marketing site + Teacher Portal + built-in LMS + automated Report Card engine. Prototype with free tools, present to school board for adoption.

## Modules
1. **Public Website** — Home, About, Academics (Nursery Montessori / Primary / Secondary WAEC-NECO-BECE), Admissions, News/Events/Calendar, Contact + Map + Inquiry form.
2. **Teacher Portal** — Assigned classes only: attendance, gradebook (CA1 + CA2 + Exam), behavior/affective logs, broadsheet review, lock/submit.
3. **LMS** — Course hubs per class/subject, lesson notes/PDFs/links, assignments with due dates + Supabase Storage submissions + inline grading, auto-graded quizzes, notice board.
4. **Report Engine** — Auto totals, averages, positions, grades; branded print-ready PDF with logo, bio-data, subject table, affective/psychomotor grids, signature placeholders, watermark.

## Roles
`admin | teacher | student | parent` — RBAC enforced in Supabase RLS.

## Recommended Stack (OpenCode-friendly)
- Frontend/Backend: Next.js (App Router, TypeScript)
- DB/Auth/Storage: Supabase (PostgreSQL + RLS)
- UI: Tailwind CSS + Shadcn UI, Lucide icons
- PDFs: `@react-pdf/renderer`
- Hosting: Vercel Free (prototype `*.vercel.app`), custom domain on adoption
- Optional AI: OpenAI/Anthropic or local Ollama for remarks/lesson plans (separate from LMS)

## Routes
- Public: `/`, `/about`, `/academics`, `/admissions`, `/contact`
- Auth: `/auth/login`
- Portals: `/portal/teacher`, `/portal/student`, `/portal/admin`
- LMS: `/lms/courses/[id]`, `/lms/assignments/[id]`
- API: `/api/reports/generate`

## DB Blueprint
`Users, Profiles, Classes(section: nursery|primary|secondary), Subjects, Enrollments, LMS_Courses, LMS_Lessons, LMS_Assignments, LMS_Submissions, Grades(ca1, ca2, exam, term, session), Reports(pdf_url)`

## Build Order with OpenCode
1. `npx create-next-app@latest` + `AGENTS.md` with stack/routes above.
2. Supabase migration + RLS (teachers edit own subjects only).
3. Public pages + admissions form → Supabase.
4. Teacher gradebook editable table with live totals/grades.
5. Assignment submit/grade flow.
6. `/api/reports/generate` → branded PDF.
7. Deploy to Vercel, demo: admissions → LMS homework loop → report PDF.

## Demo Checklist
- Submit test admission, show admin queue.
- Teacher uploads note → student downloads/submits → teacher grades.
- Enter sample scores → Generate Terminal Report PDF.

## Status
Draft PRD v1.0 only. No code yet. Next: scaffold Next.js + Supabase in this folder.
