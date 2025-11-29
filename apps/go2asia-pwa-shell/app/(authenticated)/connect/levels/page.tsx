import type { Metadata } from 'next';
import { LevelsView } from '@/components/connect/Levels';

export const metadata: Metadata = {
  title: 'Уровни и достижения | Connect Asia | Go2Asia',
  description: 'Отслеживайте свой уровень, XP и достижения',
};

export default function LevelsPage() {
  return <LevelsView />;
}

