'use client';

import { WelcomeBlock } from './WelcomeBlock';
import { AssetsBlock } from './AssetsBlock';
import { QuickActions } from './QuickActions';
import { MyContentBlock } from './MyContentBlock';
import { ActivityBlock } from './ActivityBlock';
import { RecommendationsBlock } from './RecommendationsBlock';
import type {
  User,
  DashboardStats,
  QuickAction,
  Recommendation,
  ActivityItem,
} from '../types';

interface DashboardViewProps {
  user: User;
  stats: DashboardStats;
  quickActions: QuickAction[];
  recommendations: Recommendation[];
  activities: ActivityItem[];
}

export function DashboardView({
  user,
  stats,
  quickActions,
  recommendations,
  activities,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <WelcomeBlock user={user} levelProgress={stats.levelProgress} />

      {/* Основной контент - сетка */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-6">
          <AssetsBlock stats={stats} />
          <QuickActions actions={quickActions} />
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          <MyContentBlock stats={stats} />
          <ActivityBlock activities={activities} currentUser={user} />
        </div>
      </div>

      {/* Рекомендации - на всю ширину */}
      <RecommendationsBlock recommendations={recommendations} />
    </div>
  );
}


