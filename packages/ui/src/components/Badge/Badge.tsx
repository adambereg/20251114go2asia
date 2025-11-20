import React from 'react';
import { Lock, Crown, CheckCircle } from 'lucide-react';

export interface BadgeProps {
  // Новый API (из Style Guide)
  variant?: 'ugc' | 'verified' | 'editor' | 'russian-friendly' | 'new' | 'popular' | 'prices' | 'dates' | 'photos' | 'info';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  // Старый API (для обратной совместимости)
  type?: 'lock' | 'pro' | 'rf' | 'rf-full';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  size = 'md', 
  icon, 
  children,
  type, // Старый API
  className = '' 
}) => {
  // Старый API (для обратной совместимости)
  if (type) {
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
  }

  // Новый API (из Style Guide)
  if (variant) {
    const variants = {
      ugc: 'bg-sky-100 text-sky-700',
      verified: 'bg-green-100 text-green-700',
      editor: 'bg-purple-100 text-purple-700',
      'russian-friendly': 'bg-blue-100 text-blue-700',
      new: 'bg-amber-100 text-amber-700',
      popular: 'bg-rose-100 text-rose-700',
      prices: 'bg-emerald-50 text-emerald-600',
      dates: 'bg-orange-50 text-orange-600',
      photos: 'bg-violet-50 text-violet-600',
      info: 'bg-slate-100 text-slate-700',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
    };

    return (
      <span className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variants[variant]} ${sizes[size]} ${className}
      `}>
        {icon}
        {children}
      </span>
    );
  }

  return null;
};
