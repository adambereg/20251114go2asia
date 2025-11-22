import { type ReactNode } from 'react';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
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
    <section className={cn('mb-8 md:mb-12', className)}>
      <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 md:p-12 text-white overflow-hidden relative">
        {/* Декоративные круги */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

        <div className="relative z-10 max-w-3xl">
          {/* Sparkles icon */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-medium opacity-90">{title}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{subtitle}</h1>
          <p className="text-lg md:text-xl mb-4 opacity-95">
            Всё для жизни, путешествий и работы в Юго-Восточной Азии
          </p>

          {/* Value propositions с CheckCircle */}
          <div className="mb-6 space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm md:text-base">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA кнопки */}
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryAction}
            {secondaryAction}
          </div>
        </div>
      </div>
    </section>
  );
}



