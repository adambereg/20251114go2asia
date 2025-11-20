'use client';

import { Search, Grid3x3, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SideDrawer } from './SideDrawer';

export function TopAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-sky-600" />
            <span className="text-xl font-bold text-slate-900">Go2Asia</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/atlas"
              className="text-slate-600 hover:text-sky-600 transition-colors text-sm font-medium"
            >
              Atlas
            </Link>
            <Link
              href="/pulse"
              className="text-slate-600 hover:text-sky-600 transition-colors text-sm font-medium"
            >
              Pulse
            </Link>
            <Link
              href="/blog"
              className="text-slate-600 hover:text-sky-600 transition-colors text-sm font-medium"
            >
              Blog
            </Link>
            <Link
              href="/space"
              className="text-slate-600 hover:text-sky-600 transition-colors text-sm font-medium"
            >
              Space
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search icon */}
            <button
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-all"
              aria-label="Поиск"
            >
              <Search size={20} />
            </button>

            {/* Menu button - открывает SideDrawer */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-all"
              aria-label="Все модули"
            >
              <Grid3x3 size={20} />
            </button>

            {/* Войти button */}
            <button
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
              aria-label="Войти"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}

