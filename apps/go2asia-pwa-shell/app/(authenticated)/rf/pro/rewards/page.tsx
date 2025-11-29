import type { Metadata } from 'next';
import { RewardsView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Вознаграждения | PRO Dashboard | Russian Friendly',
  description: 'История вознаграждений PRO-куратора',
};

export default function PRORewardsPage() {
  return <RewardsView />;
}

