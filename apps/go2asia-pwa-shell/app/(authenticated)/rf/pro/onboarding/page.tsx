import type { Metadata } from 'next';
import { OnboardingView } from '@/components/rf/PRO';

export const metadata: Metadata = {
  title: 'Онбординг бизнесов | PRO Dashboard | Russian Friendly',
  description: 'Приглашение и обработка заявок новых бизнесов',
};

export default function PROOnboardingPage() {
  return <OnboardingView />;
}

