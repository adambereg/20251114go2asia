import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'emerald' | 'indigo' | 'rose';
  className?: string;
  onActionClick?: () => void;
}

const gradientConfig = {
  blue: {
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
  },
  yellow: {
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
  },
  purple: {
    bg: 'from-purple-50 to-pink-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
  },
  pink: {
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    icon: 'text-rose-600',
  },
  emerald: {
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
  },
  indigo: {
    bg: 'from-indigo-50 to-blue-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
  },
  rose: {
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    icon: 'text-rose-600',
  },
};

export function BenefitCard({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  color = 'blue',
  className,
  onActionClick,
}: BenefitCardProps) {
  const config = gradientConfig[color];

  return (
    <div
      className={cn(
        'bg-gradient-to-br border-2 rounded-2xl p-5 md:p-6',
        'hover:shadow-lg hover:-translate-y-0.5 transition-all',
        config.bg,
        config.border,
        className
      )}
    >
      <div className="mb-4">
        <Icon className={cn('w-8 h-8 md:w-10 md:h-10', config.icon)} />
      </div>
      <h3 className="font-bold text-slate-900 mb-2 text-xl md:text-2xl">
        {title}
      </h3>
      <p className="text-sm md:text-base text-slate-700 mb-4 leading-relaxed">
        {description}
      </p>
      {(actionText || actionHref) && (
        <button
          onClick={onActionClick}
          className={cn(
            'text-sm md:text-base font-semibold inline-flex items-center gap-1 group',
            config.icon,
            'hover:opacity-80 transition-all'
          )}
        >
          {actionText}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}


