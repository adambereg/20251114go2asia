import type { Metadata } from 'next';
import { StatsView } from '@/components/rf/Merchant/Stats';

export const metadata: Metadata = {
  title: 'Статистика | Кабинет партнёра | Russian Friendly',
  description: 'Статистика просмотров, ваучеров и отзывов',
};

export default function MerchantStatsPage() {
  return <StatsView />;
}

