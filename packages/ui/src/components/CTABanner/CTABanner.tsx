import { type ReactNode } from 'react';
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
    <section
      className={cn(
        'bg-slate-900 text-white py-12 lg:py-16',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction}
            {secondaryAction}
          </div>
        </div>
      </div>
    </section>
  );
}


