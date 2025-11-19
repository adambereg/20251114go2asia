'use client';

import { Search, Grid3x3, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SideDrawer } from './SideDrawer';

export function TopAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              Go2Asia
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 mx-8">
            <Link
              href="/atlas"
              className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
            >
              Atlas
            </Link>
            <Link
              href="/pulse"
              className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
            >
              Pulse
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/space"
              className="text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
            >
              Space
            </Link>
          </nav>

          {/* Search - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="search"
                placeholder="Поиск по экосистеме..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                         text-sm text-slate-900 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search icon - Mobile */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Поиск"
            >
              <Search size={20} />
            </button>

            {/* Menu button - открывает SideDrawer */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Все модули"
            >
              <Grid3x3 size={20} />
            </button>

            {/* Profile */}
            <button
              className="w-8 h-8 rounded-full bg-sky-600 hover:bg-sky-700 transition-colors flex items-center justify-center"
              aria-label="Профиль"
            >
              <User size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}

