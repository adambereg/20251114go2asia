import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  requiresAuth?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  orange: 'bg-orange-50 border-orange-200',
};

export function ModuleCard({
  icon: Icon,
  title,
  description,
  color = 'blue',
  requiresAuth = false,
  className,
  onClick,
  children,
}: ModuleCardProps) {
  const Component = onClick || children ? 'div' : 'div';
  const props = onClick ? { onClick, role: 'button', tabIndex: 0 } : {};

  return (
    <Component
      {...props}
      className={cn(
        'group relative block rounded-xl border-2 p-4 sm:p-6',
        'transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-1',
        onClick && 'cursor-pointer',
        colorClasses[color],
        className
      )}
    >
      {requiresAuth && (
        <span className="absolute top-2 right-2 text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded">
          После входа
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 text-sky-600">
          <Icon size={32} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </Component>
  );
}



