import type { Metadata } from 'next';
import { LeaderboardView } from './LeaderboardView';

export const metadata: Metadata = {
  title: 'Лидерборд - Quest Asia | Go2Asia',
  description: 'Топ игроков Quest Asia по городам, неделям и сезонам',
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}

