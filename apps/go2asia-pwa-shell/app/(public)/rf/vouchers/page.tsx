import type { Metadata } from 'next';
import { VouchersCatalogView } from '@/components/rf/Vouchers';

export const metadata: Metadata = {
  title: 'Ваучеры | Russian Friendly | Go2Asia',
  description: 'Специальные предложения и ваучеры от партнёров Russian Friendly в Юго-Восточной Азии',
  openGraph: {
    title: 'Ваучеры | Russian Friendly',
    description: 'Специальные предложения от партнёров Russian Friendly',
    type: 'website',
  },
};

export default function VouchersPage() {
  return <VouchersCatalogView />;
}

