import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Lock } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'emerald' | 'amber';
  requiresAuth?: boolean;
  className?: string;
  onClick?: () => void;
  children?: ReactNode;
}

const gradientClasses = {
  blue: 'from-sky-500 to-sky-600',
  green: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-amber-500 to-amber-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
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
  const Component = onClick ? 'button' : 'div';
  const props = onClick ? { onClick, type: 'button' as const } : {};

  return (
    <Component
      {...props}
      className={cn(
        'group relative bg-gradient-to-br text-white rounded-xl p-4 md:p-6',
        'hover:shadow-xl hover:-translate-y-1 transition-all duration-200',
        'text-left w-full h-full flex flex-col',
        gradientClasses[color],
        className
      )}
    >
      {requiresAuth && (
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
          <Lock size={12} />
          <span className="hidden sm:inline">После входа</span>
        </div>
      )}
      <div className="mb-2">
        <Icon size={32} className="text-white" />
      </div>
      <h3 className="font-bold text-base md:text-lg mb-1">{title}</h3>
      <p className="text-xs md:text-sm opacity-90">{description}</p>
      {children}
    </Component>
  );
}



