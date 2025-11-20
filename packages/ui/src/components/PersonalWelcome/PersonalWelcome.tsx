import { type ReactNode } from 'react';
import { MapPin, Coins, Award, Users, Ticket, Star, Target, Gift, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface PersonalWelcomeProps {
  userName: string;
  userAvatar?: string;
  currentLocation: string;
  level: number;
  levelProgress: number; // 0-100
  pointsToNextLevel: number;
  pointsBalance: number;
  unfinishedNFTs: number;
  teamMembers: number;
  activeQuests: number;
  className?: string;
  onContinueQuest?: () => void;
  onNewVouchers?: () => void;
  onReferralLink?: () => void;
}

export function PersonalWelcome({
  userName,
  userAvatar,
  currentLocation,
  level,
  levelProgress,
  pointsToNextLevel,
  pointsBalance,
  unfinishedNFTs,
  teamMembers,
  activeQuests,
  className,
  onContinueQuest,
  onNewVouchers,
  onReferralLink,
}: PersonalWelcomeProps) {
  return (
    <section className={cn('mb-8 md:mb-12', className)}>
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 md:p-7 text-white">
        {/* Аватар + инфо */}
        <div className="flex items-start gap-4 mb-5">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-1">{userName}</h2>
            <div className="flex items-center gap-1.5 text-xs md:text-sm opacity-90">
              <MapPin size={14} />
              <span>Сейчас: {currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold flex items-center gap-1.5">
              <Star size={16} />
              Level {level}
            </span>
            <span className="text-sm font-bold">{levelProgress}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-1">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <p className="text-xs opacity-80">+{pointsToNextLevel} Points до следующего уровня</p>
        </div>

        {/* Mini Stats Grid (2x2 на mobile, 4x1 на desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Coins size={18} className="text-yellow-200" />
              <span className="text-lg font-bold">{pointsBalance.toLocaleString()}</span>
            </div>
            <p className="text-xs opacity-90">Points на балансе</p>
          </button>
          <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Award size={18} className="text-yellow-200" />
              <span className="text-lg font-bold">{unfinishedNFTs}</span>
            </div>
            <p className="text-xs opacity-90">коллекционных NFT</p>
          </button>
          <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} className="text-yellow-200" />
              <span className="text-lg font-bold">{teamMembers}</span>
            </div>
            <p className="text-xs opacity-90">человек в команде</p>
          </button>
          <button className="bg-white/15 hover:bg-white/25 backdrop-blur rounded-xl p-3 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Ticket size={18} className="text-yellow-200" />
              <span className="text-lg font-bold">{activeQuests}</span>
            </div>
            <p className="text-xs opacity-90">активных ваучера</p>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {onContinueQuest && (
            <button
              onClick={onContinueQuest}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-lg text-sm flex items-center gap-2"
            >
              <Target size={16} />
              Продолжить квест
            </button>
          )}
          {onNewVouchers && (
            <button
              onClick={onNewVouchers}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-lg text-sm flex items-center gap-2"
            >
              <Gift size={16} />
              Новые ваучеры
            </button>
          )}
          {onReferralLink && (
            <button
              onClick={onReferralLink}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur rounded-lg text-sm flex items-center gap-2"
            >
              <TrendingUp size={16} />
              Реферальная ссылка
            </button>
          )}
        </div>
      </div>
    </section>
  );
}


