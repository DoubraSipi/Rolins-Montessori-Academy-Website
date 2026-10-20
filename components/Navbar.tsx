import Link from 'next/link';
import Image from 'next/image';

const links = [
  { href: '/about', label: 'About' },
  { href: '/academics', label: 'Academics' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Rolins Montessori Academy crest"
            width={52}
            height={52}
            priority
            className="h-13 w-13 rounded-xl object-contain"
            style={{ width: 52, height: 52 }}
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-brand-900">
              Rolins Montessori Academy
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson-500">
              Limitless Opportunities
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
