import type { Metadata } from 'next';
import { MissionsView } from '@/components/connect/Missions';

export const metadata: Metadata = {
  title: 'Миссии | Connect Asia | Go2Asia',
  description: 'Выполняйте задания и получайте награды',
};

export default function MissionsPage() {
  return <MissionsView />;
}

