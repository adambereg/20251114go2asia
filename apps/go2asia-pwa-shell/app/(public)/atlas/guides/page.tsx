import type { Metadata } from 'next';
import { GuideView } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Гайды Atlas Asia',
  description:
    'Подборки и маршруты по странам и городам Юго-Восточной Азии: для новичков, путешественников и PRO-спейсеров.',
};

export default function GuidesIndexPage() {
  return (
    <GuideView
      title="Гайды Atlas Asia"
      audience="Для путешественников и экспатов"
      budgetHint="разные уровни бюджета"
      durationHint="от 1 до 30 дней"
      seasonHint="учитываем сезонность и погоду"
      places={[]}
    />
  );
}


