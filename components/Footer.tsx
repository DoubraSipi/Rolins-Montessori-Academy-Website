import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Rolins Montessori Academy crest"
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg bg-white/90 object-contain p-1"
            />
            <span className="font-display text-lg font-semibold">Rolins Montessori Academy</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
            Nurturing curious minds in Alakahia, Port Harcourt since 2009.
          </p>
          <p className="mt-3 font-display text-sm italic text-gold-300">Limitless Opportunities</p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: '/about', label: 'About us' },
              { href: '/academics', label: 'Academics' },
              { href: '/admissions', label: 'Admissions' },
              { href: '/contact', label: 'Contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-200/80 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">Programs</h4>
          <ul className="space-y-2.5 text-sm text-brand-200/80">
            <li>Nursery (Montessori)</li>
            <li>Primary School</li>
            <li>Secondary School</li>
            <li>Clubs &amp; Sports</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">Reach us</h4>
          <ul className="space-y-2.5 text-sm text-brand-200/80">
            <li>Rumuologu Road / UPTH Junction</li>
            <li>Alakahia, Obio/Akpor</li>
            <li>Port Harcourt, Rivers State</li>
            <li className="pt-1">RC 1276137</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-200/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Rolins Montessori Academy LTD. All rights reserved.</span>
          <span>Built for learning, with care.</span>
        </div>
      </div>
    </footer>
  );
}
