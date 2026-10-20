import Link from 'next/link';

const links = [
  { href: '/about', label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-display text-lg font-bold text-gold-300">
            R
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-brand-900">
            Rolins Montessori
            <span className="block text-xs font-sans font-normal uppercase tracking-wider text-slate-500">
              Academy LTD
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-brand-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden text-sm font-medium text-brand-800 hover:text-brand-600 sm:block">
            Portal
          </Link>
          <Link href="/admissions" className="btn-primary">
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}
