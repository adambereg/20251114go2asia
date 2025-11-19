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
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer',
        'transition-all duration-200 hover:scale-105',
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt || name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Изображение</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-xs text-white/80 mb-1">{type}</p>
        <p className="text-sm font-semibold text-white mb-0.5">{name}</p>
        <p className="text-xs text-white/80">{country}</p>
      </div>
    </div>
  );
}


