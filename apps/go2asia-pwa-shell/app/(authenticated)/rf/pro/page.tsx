import type { Metadata } from 'next';
import { PRODashboardView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'PRO Dashboard | Russian Friendly | Go2Asia',
  description: 'Панель управления PRO-куратора',
};

export default function PRODashboardPage() {
  return <PRODashboardView />;
}

