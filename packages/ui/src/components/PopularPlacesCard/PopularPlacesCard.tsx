import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PopularPlacesCardProps {
  image?: string;
  imageAlt?: string;
  type: string;
  name: string;
  country: string;
  className?: string;
  onClick?: () => void;
}

export function PopularPlacesCard({
  image,
  imageAlt,
  type,
  name,
  country,
  className,
  onClick,
}: PopularPlacesCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-48 md:w-64 bg-white rounded-xl border-2 border-slate-200 overflow-hidden',
        'hover:shadow-lg hover:border-sky-300 hover:-translate-y-1 transition-all',
        'text-left',
        className
      )}
    >
      <div className="aspect-[4/3] overflow-hidden">
        {image ? (
          <img src={image} alt={imageAlt || name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Изображение</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-sky-600 font-medium mb-1">{type}</div>
        <h3 className="font-bold text-xl md:text-2xl text-slate-900 mb-1">{name}</h3>
        <p className="text-sm md:text-base text-slate-600">{country}</p>
      </div>
    </button>
  );
}


