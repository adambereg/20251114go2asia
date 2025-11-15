import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  variant:
    | 'ugc'
    | 'verified'
    | 'editor'
    | 'russian-friendly'
    | 'new'
    | 'popular'
    | 'prices'
    | 'dates'
    | 'photos'
    | 'info';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  ugc: 'bg-sky-100 text-sky-700',
  verified: 'bg-green-100 text-green-700',
  editor: 'bg-purple-100 text-purple-700',
  'russian-friendly': 'bg-blue-100 text-blue-700',
  new: 'bg-amber-100 text-amber-700',
  popular: 'bg-rose-100 text-rose-700',
  prices: 'bg-emerald-50 text-emerald-600',
  dates: 'bg-orange-50 text-orange-600',
  photos: 'bg-violet-50 text-violet-600',
  info: 'bg-blue-100 text-blue-700',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  variant,
  size = 'md',
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

