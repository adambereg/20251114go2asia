import { Star, Gem, Target } from 'lucide-react';
import { cn } from '@go2asia/ui';

export interface Reward {
  id: string;
  icon: 'star' | 'gem' | 'target';
  text: string;
  timeAgo: string;
}

interface RewardsListProps {
  rewards: Reward[];
  className?: string;
}

const iconMap = {
  star: Star,
  gem: Gem,
  target: Target,
};

export function RewardsList({ rewards, className }: RewardsListProps) {
  if (rewards.length === 0) {
    return null;
  }

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12', className)}>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Ваши награды
        </h2>
        <p className="text-sm sm:text-base text-slate-600">Последние начисления</p>
      </div>
      <div className="space-y-3">
        {rewards.map((reward) => {
          const Icon = iconMap[reward.icon];
          return (
            <div
              key={reward.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <Icon size={20} className="text-sky-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{reward.text}</p>
                <p className="text-xs text-slate-500 mt-0.5">{reward.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

