import { type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CTABannerProps {
  title: string;
  description: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}

export function CTABanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white text-center',
        className
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}


