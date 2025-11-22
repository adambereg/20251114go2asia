import type { Metadata } from 'next';
import { GuideView } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Гайд Atlas Asia | Go2Asia',
  description:
    'Авторские гайды и подборки по городам и темам Юго-Восточной Азии с маршрутами и лайфхаками.',
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Сейчас только каркас; данные гайда будут приходить из Atlas / Quest API.
  return (
    <GuideView
      title="Гайд в разработке"
      audience="Для новичков"
      budgetHint="$$"
      durationHint="3–5 дней"
      seasonHint="Лучше в сухой сезон"
      places={[]}
    />
  );
}


