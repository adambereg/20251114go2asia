import { type ReactNode } from 'react';
import { MapPin, Gem, Headphones, Users, FileText, Compass, Calendar, TrendingUp } from 'lucide-react';
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
    <section
      className={cn(
        'bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl p-6 sm:p-8',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: Avatar and Info */}
        <div className="flex items-start gap-4">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20">
              <span className="text-2xl font-bold">{userName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">{userName}</h2>
            <div className="flex items-center gap-2 text-sm text-white/90 mb-4">
              <MapPin size={16} />
              <span>Сейчас: {currentLocation}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium">Level {level}</span>
              <div className="flex-1 bg-white/20 rounded-full h-2 max-w-xs">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/80">
              +{pointsToNextLevel} Points до следующего уровня
            </p>
          </div>
        </div>

        {/* Right: Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gem size={18} />
              <span className="text-xs text-white/80">Points на балансе</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">{pointsBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Headphones size={18} />
              <span className="text-xs text-white/80">незавершенных NFT</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">{unfinishedNFTs}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users size={18} />
              <span className="text-xs text-white/80">человек в команде</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">{teamMembers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={18} />
              <span className="text-xs text-white/80">активных квеста</span>
            </div>
            <p className="text-lg sm:text-xl font-bold">{activeQuests}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/20">
        {onContinueQuest && (
          <button
            onClick={onContinueQuest}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
          >
            <Compass size={18} />
            Продолжить квест
          </button>
        )}
        {onNewVouchers && (
          <button
            onClick={onNewVouchers}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
          >
            <Calendar size={18} />
            Новые ваучеры
          </button>
        )}
        {onReferralLink && (
          <button
            onClick={onReferralLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
          >
            <TrendingUp size={18} />
            Реферальная ссылка
          </button>
        )}
      </div>
    </section>
  );
}


