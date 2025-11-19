import { type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface HeroSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  features?: string[];
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export function HeroSection({
  className,
  title = 'Добро пожаловать в экосистему',
  subtitle = 'Go2Asia',
  features = [
    'Гайды и события по всей ЮВА',
    'Сообщество и квесты для путешественников',
    'Points, токены и NFT за активность',
  ],
  primaryAction,
  secondaryAction,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'bg-gradient-to-br from-sky-600 to-sky-700 text-white',
        'py-12 lg:py-16',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {title}
          </h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {subtitle}
          </h2>
          <p className="text-base sm:text-lg text-sky-100 mb-8">
            Всё для жизни, путешествий и работы в Юго-Восточной Азии
          </p>

          {/* Features */}
          <ul className="flex flex-col items-start sm:items-center gap-3 mb-8 text-left sm:text-center">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm sm:text-base">
                <Check size={20} className="flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryAction}
            {secondaryAction}
          </div>
        </div>
      </div>
    </section>
  );
}



