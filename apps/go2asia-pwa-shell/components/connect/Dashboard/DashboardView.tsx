'use client';

import { useState } from 'react';
import { ConnectHero, ConnectNav } from '../Shared';
import { BalanceCards } from './BalanceCards';
import { ProgressPanel } from './ProgressPanel';
import { NextActions } from './NextActions';
import { ActivityFeed } from './ActivityFeed';
import type { DashboardData } from '../types';
import { mockDashboardData } from '../mockData';

interface DashboardViewProps {
  initialData?: DashboardData;
}

export function DashboardView({ initialData = mockDashboardData }: DashboardViewProps) {
  const [data] = useState(initialData);

  const handleViewHistory = () => {
    window.location.href = '/connect/wallet';
  };

  const handleTopUp = () => {
    // Mock действие - будет реализовано позже
    console.log('Top up G2A');
  };

  const handleWithdraw = () => {
    // Mock действие - будет реализовано позже
    console.log('Withdraw G2A');
  };

  const handleViewNFT = () => {
    window.location.href = '/connect/wallet?tab=nft';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ConnectHero subtitle="Центр экономики и геймификации Go2Asia" />

      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <ConnectNav />
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Балансы */}
        <BalanceCards
          balances={data.balances}
          onViewHistory={handleViewHistory}
          onTopUp={handleTopUp}
          onWithdraw={handleWithdraw}
          onViewNFT={handleViewNFT}
        />

        {/* Прогресс уровня */}
        <ProgressPanel level={data.level} season={data.season} />

        {/* Рекомендуемые действия */}
        <NextActions actions={data.next_actions} />

        {/* Последняя активность */}
        <ActivityFeed transactions={data.recent_transactions} />
      </div>
    </div>
  );
}

