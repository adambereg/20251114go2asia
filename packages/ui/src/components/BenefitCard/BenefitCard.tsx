import { type ReactNode, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  className?: string;
  onActionClick?: () => void;
}

const colorClasses = {
  blue: 'bg-sky-50',
  green: 'bg-green-50',
  yellow: 'bg-amber-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
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
  return (
    <div
      className={cn(
        'rounded-xl p-5 sm:p-6',
        colorClasses[color],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon size={24} className="text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 mb-2 text-sm sm:text-base">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-3">
            {description}
          </p>
          {(actionText || actionHref) && (
            <button
              onClick={onActionClick}
              className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
            >
              {actionText} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


