import type { Metadata } from 'next';
import { MerchantDashboardView } from '@/components/rf/Merchant';

export const metadata: Metadata = {
  title: 'Кабинет партнёра | Russian Friendly | Go2Asia',
  description: 'Управление профилем партнёра, ваучерами и статистикой',
};

export default function MerchantDashboardPage() {
  return <MerchantDashboardView />;
}

