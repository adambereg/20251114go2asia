import React from 'react';
import { Lock, Crown, CheckCircle, CheckCircle2, Info } from 'lucide-react';

export interface BadgeProps {
  type?: 'lock' | 'pro' | 'rf' | 'rf-full';
  variant?: 'verified' | 'info' | 'ugc' | 'editor' | 'russian-friendly' | 'new' | 'popular';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, variant, icon, children, className = '' }) => {
  // Новый API для модулей (type)
  if (type === 'lock') {
    return (
      <div className={`absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium ${className}`}>
        <Lock size={12} />
        <span className="hidden sm:inline">После входа</span>
      </div>
    );
  }

  if (type === 'pro') {
    return (
      <div className={`absolute top-2 right-2 bg-purple-500 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold ${className}`}>
        <Crown size={12} />
        PRO
      </div>
    );
  }

  if (type === 'rf') {
    return (
      <span className={`px-1.5 py-0.5 bg-green-600 text-white rounded text-xs font-bold shadow-lg ${className}`}>
        RF
      </span>
    );
  }

  if (type === 'rf-full') {
    return (
      <div className={`px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center gap-1.5 ${className}`}>
        <CheckCircle size={16} />
        Russian Friendly
      </div>
    );
  }

  // Старый API для контента (variant)
  if (variant === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium ${className}`}>
        {icon || <CheckCircle2 size={12} />}
        {children}
      </span>
    );
  }

  if (variant === 'info') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ${className}`}>
        {icon || <Info size={12} />}
        {children}
      </span>
    );
  }

  if (variant === 'ugc') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {children}
      </span>
    );
  }

  if (variant === 'editor') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {children}
      </span>
    );
  }

  if (variant === 'russian-friendly') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {children}
      </span>
    );
  }

  if (variant === 'new') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {children}
      </span>
    );
  }

  if (variant === 'popular') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {children}
      </span>
    );
  }

  return null;
};
