'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Calendar, Target, User } from 'lucide-react';
import { cn } from '@go2asia/ui';

const navItems = [
  { href: '/', icon: Home, label: 'Главная' },
  { href: '/atlas', icon: MapPin, label: 'Карта' },
  { href: '/pulse', icon: Calendar, label: 'События' },
  { href: '/quest', icon: Target, label: 'Квесты' },
  { href: '/space/me', icon: User, label: 'Профиль' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'transition-colors',
                isActive
                  ? 'text-sky-600'
                  : 'text-slate-600 hover:text-sky-600'
              )}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

