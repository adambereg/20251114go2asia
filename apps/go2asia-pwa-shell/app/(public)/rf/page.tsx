import type { Metadata } from 'next';
import { CatalogView } from '@/components/rf/Catalog';

export const metadata: Metadata = {
  title: 'Russian Friendly - Партнёрская программа | Go2Asia',
  description: 'Каталог проверенных Russian Friendly мест и сервисов в Юго-Восточной Азии',
  openGraph: {
    title: 'Russian Friendly - Партнёрская программа',
    description: 'Каталог проверенных Russian Friendly мест и сервисов в ЮВА',
    type: 'website',
  },
};

export default function RFPage() {
  return <CatalogView />;
}














