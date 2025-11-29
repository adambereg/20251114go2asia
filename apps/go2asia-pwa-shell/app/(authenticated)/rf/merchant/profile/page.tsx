import type { Metadata } from 'next';
import { ProfileView } from '@/components/rf/Merchant/Profile';

export const metadata: Metadata = {
  title: 'Профиль заведения | Кабинет партнёра | Russian Friendly',
  description: 'Редактирование информации о заведении',
};

export default function MerchantProfilePage() {
  return <ProfileView />;
}

