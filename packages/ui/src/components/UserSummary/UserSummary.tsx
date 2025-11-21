import React from 'react';
import { MapPin, Star, Coins, Award, Users, Ticket, Compass, Gift, TrendingUp } from 'lucide-react';

export interface UserSummaryProps {
  name: string;
  initials: string;
  location: string;
  level: number;
  progress: number;
  pointsToNextLevel: number;
  stats: {
    points: number;
    nfts: number;
    teamMembers: number;
    vouchers: number;
  };
  recentActivity?: {
    quests: number;
    posts: number;
    reviews: number;
  };
  isPro?: boolean;
  className?: string;
  onContinueQuest?: () => void;
  onNewVouchers?: () => void;
  onReferralLink?: () => void;
}

export const UserSummary: React.FC<UserSummaryProps> = ({
  name,
  initials,
  location,
  level,
  progress,
  pointsToNextLevel,
  stats,
  recentActivity,
  isPro = false,
  className = '',
  onContinueQuest,
  onNewVouchers,
  onReferralLink,
}) => {
  return (
    <div className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-7 text-white ${className}`}>
      {/* Top Row: Identity + Progress */}
      <div className="flex items-start gap-4 mb-5 md:mb-6">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-3 md:gap-4 flex-1">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-2xl md:text-3xl font-bold">{name}</h2>
              {isPro && (
                <span className="px-2 py-0.5 bg-purple-500 rounded-md text-xs font-bold flex items-center gap-1">
                  <Star size={12} />
                  PRO
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs md:text-sm opacity-90">
              <MapPin size={14} className="flex-shrink-0" />
              <span>Сейчас: {location}</span>
            </div>
          </div>
        </div>

        {/* Right: Level + Progress (Desktop) */}
        <div className="hidden md:block min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <Star size={16} />
              Level {level}
            </span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-1">
            <div className="bg-white rounded-full h-2" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs opacity-80 mb-2">+{pointsToNextLevel} Points до следующего уровня</p>
          {recentActivity && (
            <p className="text-xs opacity-80">
              За 30 дней: {recentActivity.quests} квестов, {recentActivity.posts} постов, {recentActivity.reviews} отзывов
            </p>
          )}
        </div>
      </div>

      {/* Mobile Level Progress */}
      <div className="md:hidden mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold flex items-center gap-1.5">
            <Star size={16} />
            Level {level}
          </span>
          <span className="text-sm font-bold">{progress}%</span>
        </div>
        <div className="bg-white/20 rounded-full h-2 mb-1">
          <div className="bg-white rounded-full h-2" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs opacity-80 mb-2">+{pointsToNextLevel} Points до следующего уровня</p>
        {recentActivity && (
          <p className="text-xs opacity-80">
            За 30 дней: {recentActivity.quests} квестов, {recentActivity.posts} постов, {recentActivity.reviews} отзывов
          </p>
        )}
      </div>

      {/* Middle Row: Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-5">
        <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 md:p-4 transition-all text-left">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={18} className="text-yellow-200" />
            <span className="text-lg md:text-xl font-bold">{stats.points.toLocaleString()}</span>
          </div>
          <p className="text-xs opacity-90">Points на балансе</p>
        </button>

        <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 md:p-4 transition-all text-left">
          <div className="flex items-center gap-2 mb-1">
            <Award size={18} className="text-purple-200" />
            <span className="text-lg md:text-xl font-bold">{stats.nfts}</span>
          </div>
          <p className="text-xs opacity-90">коллекционных NFT</p>
        </button>

        <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 md:p-4 transition-all text-left">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-blue-200" />
            <span className="text-lg md:text-xl font-bold">{stats.teamMembers}</span>
          </div>
          <p className="text-xs opacity-90">человек в команде</p>
        </button>

        <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 md:p-4 transition-all text-left">
          <div className="flex items-center gap-2 mb-1">
            <Ticket size={18} className="text-green-200" />
            <span className="text-lg md:text-xl font-bold">{stats.vouchers}</span>
          </div>
          <p className="text-xs opacity-90">активных ваучера</p>
        </button>
      </div>

      {/* Bottom Row: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContinueQuest}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl px-4 py-3 transition-all text-left flex-1"
        >
          <Compass size={20} />
          <span className="font-medium">Продолжить квест</span>
        </button>
        <button
          onClick={onNewVouchers}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl px-4 py-3 transition-all text-left flex-1"
        >
          <Gift size={20} />
          <span className="font-medium">Новые ваучеры</span>
        </button>
        <button
          onClick={onReferralLink}
          className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl px-4 py-3 transition-all text-left flex-1"
        >
          <TrendingUp size={20} />
          <span className="font-medium">Реферальная ссылка</span>
        </button>
      </div>
    </div>
  );
};

