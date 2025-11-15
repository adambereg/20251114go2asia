import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ChipProps {
  selected?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
  onRemove?: () => void;
  children: ReactNode;
  className?: string;
}

export function Chip({
  selected = false,
  size = 'md',
  onClick,
  onRemove,
  children,
  className,
}: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        'transition-all duration-150',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        selected
          ? 'bg-sky-600 text-white shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        className
      )}
    >
      {children}
      {onRemove && (
        <X
          size={size === 'sm' ? 12 : 14}
          className="hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}

