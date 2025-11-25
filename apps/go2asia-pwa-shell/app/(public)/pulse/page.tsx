import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { PulseClient } from './PulseClient';
import { Globe } from 'lucide-react';
import { mockEvents } from '@/components/pulse/mockEvents';

export const metadata: Metadata = {
  title: 'Pulse Asia - События и мероприятия | Go2Asia',
  description: 'Актуальные события и мероприятия в Юго-Восточной Азии',
};

export default function PulsePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Pulse Asia"
        description="События и мероприятия в Юго-Восточной Азии"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      <PulseClient events={mockEvents} />
    </div>
  );
}
