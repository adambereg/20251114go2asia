import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/atlas/countries', label: 'Страны' },
  { href: '/atlas/cities', label: 'Города' },
  { href: '/atlas/places', label: 'Места' },
  { href: '/atlas/guides', label: 'Гайды' },
  { href: '/atlas/themes', label: 'Темы' },
] as const;

export function AtlasMainNav() {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm mb-6">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-500 hover:text-sky-600 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default AtlasMainNav;


