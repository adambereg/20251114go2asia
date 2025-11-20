import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface EventCardProps {
  image?: string;
  imageAlt?: string;
  date: string;
  location?: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export function EventCard({
  image,
  imageAlt,
  date,
  location,
  title,
  className,
  onClick,
}: EventCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-72 bg-white rounded-xl border-2 border-slate-200 overflow-hidden',
        'hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all',
        'text-left',
        className
      )}
    >
      <div className="aspect-[4/3] overflow-hidden">
        {image ? (
          <img src={image} alt={imageAlt || title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Изображение</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
          <span>{date}</span>
          {location && (
            <>
              <span>•</span>
              <span>{location}</span>
            </>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{title}</h3>
      </div>
    </button>
  );
}


