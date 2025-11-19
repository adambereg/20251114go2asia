'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Target,
  Handshake,
  Building,
  Wallet,
  Briefcase,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@go2asia/ui';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    href: '/guru',
    icon: MapPin,
    label: 'Guru Asia',
    description: 'Рекомендации от гидов',
    color: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    href: '/quest',
    icon: Target,
    label: 'Quest Asia',
    description: 'Квесты и челленджи',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    href: '/rielt',
    icon: Building,
    label: 'Rielt.Market',
    description: 'Поиск жилья',
    color: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    href: '/rf',
    icon: Building,
    label: 'Russian Friendly',
    description: 'Партнёры и скидки',
    color: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    href: '/connect',
    icon: Wallet,
    label: 'Connect Asia',
    description: 'Баланс и награды',
    color: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    href: '/admin',
    icon: Briefcase,
    label: 'Партнёрская панель',
    description: 'Управление заведением',
    color: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
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
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Все модули</h2>
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
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl transition-all',
                      'hover:shadow-md',
                      isActive && 'ring-2 ring-sky-500'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        item.color
                      )}
                    >
                      <Icon size={24} className={item.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm mb-0.5">
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-600">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Быстрые ссылки</h3>
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
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Go2Asia v1.0. © 2024
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

