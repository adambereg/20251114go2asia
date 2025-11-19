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
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl overflow-hidden bg-white border border-slate-200',
        'cursor-pointer transition-all duration-200 hover:shadow-lg',
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt || title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-slate-200 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Изображение</span>
        </div>
      )}
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
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}


