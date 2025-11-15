'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, MapPin, Calendar, BookOpen, Users, Target, Handshake, Building, Wallet, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@go2asia/ui';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/', icon: Home, label: 'Главная' },
  { href: '/atlas', icon: MapPin, label: 'Atlas Asia' },
  { href: '/pulse', icon: Calendar, label: 'Pulse Asia' },
  { href: '/blog', icon: BookOpen, label: 'Blog Asia' },
  { href: '/space', icon: Users, label: 'Space Asia' },
  { href: '/quest', icon: Target, label: 'Quest Asia' },
  { href: '/rf', icon: Handshake, label: 'Russian Friendly' },
  { href: '/rielt', icon: Building, label: 'Rielt.Market' },
  { href: '/connect', icon: Wallet, label: 'Connect Asia' },
];

const footerItems = [
  { href: '/settings', icon: Settings, label: 'Настройки' },
  { href: '/help', icon: HelpCircle, label: 'Помощь' },
];

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-lg font-bold text-slate-900">Go2Asia</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Закрыть меню"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg',
                        'transition-colors',
                        isActive
                          ? 'bg-sky-100 text-sky-700 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <ul className="space-y-1">
              {footerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
                  <LogOut size={20} />
                  <span>Выйти</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

