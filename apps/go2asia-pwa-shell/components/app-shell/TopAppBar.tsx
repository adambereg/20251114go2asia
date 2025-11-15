'use client';

import { Search, Bell, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SideDrawer } from './SideDrawer';

export function TopAppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">
              Go2Asia
            </span>
          </Link>

          {/* Search - скрыт на мобильных */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
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
          <div className="flex items-center gap-3">
            {/* Search icon на мобильных */}
            <button
              className="md:hidden p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Поиск"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Уведомления"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile placeholder */}
            <button
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
              aria-label="Профиль"
            >
              <span className="text-slate-600 text-sm font-medium">?</span>
            </button>

            {/* Menu на мобильных */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Меню"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
}

