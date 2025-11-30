'use client';

import { ConnectHero, ConnectNav } from '../Shared';
import { BalanceCards } from './BalanceCards';
import { ProgressPanel } from './ProgressPanel';
import { NextActions } from './NextActions';
import { ActivityFeed } from './ActivityFeed';
import { useGetBalance } from '@go2asia/sdk/balance';
import { useGetReferralStats } from '@go2asia/sdk/referrals';
import { useGetTransactions } from '@go2asia/sdk/transactions';
import { useMemo } from 'react';
import type { DashboardData } from '../types';
import { mockDashboardData } from '../mockData';

interface DashboardViewProps {
  initialData?: DashboardData;
}

export function DashboardView({ initialData }: DashboardViewProps) {
  // Загружаем баланс из Token Service
  const { data: balanceData, isLoading: balanceLoading } = useGetBalance();
  
  // Загружаем статистику рефералов
  const { data: referralStats } = useGetReferralStats();
  
  // Загружаем последние транзакции
  const { data: transactionsData } = useGetTransactions({ limit: 10 });

  // Преобразуем данные из API в формат компонента
  const data = useMemo(() => {
    if (initialData) return initialData;
    
    const balances = balanceData
      ? {
          points: balanceData.points || 0,
          g2a: parseFloat(String(balanceData.g2a || '0')),
          nft_count: 0, // TODO: получить из NFT badges API
          nft_legendary_count: 0, // TODO: получить из NFT badges API
        }
      : mockDashboardData.balances;

    const recentTransactions = (transactionsData?.items?.map((tx) => ({
      id: tx.id,
      type: tx.type === 'points_add' ? 'earn' : 'spend',
      amount: parseInt(String(tx.amount || '0')),
      reason: tx.reason || '',
      timestamp: tx.createdAt || new Date().toISOString(),
    })) || mockDashboardData.recent_transactions) as typeof mockDashboardData.recent_transactions;

    return {
      ...mockDashboardData,
      balances,
      recent_transactions: recentTransactions,
      referral_stats: referralStats || undefined,
    };
  }, [balanceData, transactionsData, referralStats, initialData]);

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

