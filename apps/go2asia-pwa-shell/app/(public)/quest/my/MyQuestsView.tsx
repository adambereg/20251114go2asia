'use client';

/**
 * Quest Asia - My Quests View
 * Главный компонент страницы "Мои квесты"
 */

import { useState, useEffect } from 'react';
import { QuestTabs } from '@/components/quest/MyQuests/QuestTabs';
import { ActiveQuestCard } from '@/components/quest/MyQuests/ActiveQuestCard';
import { CompletedQuestCard } from '@/components/quest/MyQuests/CompletedQuestCard';
import { DraftQuestCard } from '@/components/quest/MyQuests/DraftQuestCard';
import { EmptyState } from '@/components/quest/Shared/EmptyState';
import type { Quest, QuestProgress } from '@/components/quest/types';
import { mockQuests } from '@/components/quest/mockQuests';
import { isOnline } from '@/components/quest/utils/offline';
import { BookOpen, Trophy, FileEdit } from 'lucide-react';

type TabType = 'active' | 'completed' | 'drafts';

/**
 * Загрузить все прогрессы из localStorage
 */
function loadAllProgresses(): QuestProgress[] {
  const progresses: QuestProgress[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quest-progress-')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          progresses.push({
            ...data,
            startedAt: new Date(data.startedAt),
            completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
            pausedAt: data.pausedAt ? new Date(data.pausedAt) : undefined,
            offlineData: {
              ...data.offlineData,
              lastSyncAt: data.offlineData.lastSyncAt ? new Date(data.offlineData.lastSyncAt) : undefined,
            },
            stepResults: Object.fromEntries(
              Object.entries(data.stepResults || {}).map(([key, value]: [string, any]) => [
                key,
                {
                  ...value,
                  completedAt: new Date(value.completedAt),
                },
              ])
            ),
          } as QuestProgress);
        }
      }
    }
  } catch (error) {
    console.error('Failed to load progresses from localStorage:', error);
  }
  
  return progresses;
}

export function MyQuestsView() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [progresses, setProgresses] = useState<QuestProgress[]>([]);
  const [isOnlineState, setIsOnlineState] = useState(true);

  useEffect(() => {
    // Загружаем прогрессы из localStorage
    const loadedProgresses = loadAllProgresses();
    setProgresses(loadedProgresses);

    // Проверяем статус сети
    setIsOnlineState(isOnline());

    // Подписываемся на изменения сети
    const handleOnline = () => setIsOnlineState(true);
    const handleOffline = () => setIsOnlineState(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Фильтруем квесты по статусу
  const activeProgresses = progresses.filter((p) => p.status === 'active' || p.status === 'paused');
  const completedProgresses = progresses.filter((p) => p.status === 'completed');
  
  // Для демо: добавляем несколько завершённых квестов
  const demoCompletedQuests: Array<{ quest: Quest; progress: QuestProgress }> = [];
  
  // Получаем квесты для активных и завершённых прогрессов
  const activeQuestsWithProgress = activeProgresses
    .map((progress) => {
      const quest = mockQuests.find((q) => q.id === progress.questId);
      return quest ? { quest, progress } : null;
    })
    .filter((item): item is { quest: Quest; progress: QuestProgress } => item !== null);

  const completedQuestsWithProgress = completedProgresses
    .map((progress) => {
      const quest = mockQuests.find((q) => q.id === progress.questId);
      return quest ? { quest, progress } : null;
    })
    .filter((item): item is { quest: Quest; progress: QuestProgress } => item !== null);

  // Для демо: добавляем несколько завершённых квестов из mockQuests
  if (completedQuestsWithProgress.length === 0) {
    // Добавляем демо-данные для завершённых квестов
    const demoQuests = mockQuests.slice(0, 3);
    demoQuests.forEach((quest) => {
      const demoProgress: QuestProgress = {
        questId: quest.id,
        userId: 'demo-user',
        status: 'completed',
        currentStep: quest.steps.length,
        completedSteps: quest.steps.map((s) => s.id),
        startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 дней назад
        offlineData: {
          cached: false,
          pendingActions: [],
        },
        stepResults: {},
      };
      completedQuestsWithProgress.push({ quest, progress: demoProgress });
    });
  }

  // Черновики (для PRO-пользователей) - пока пусто
  const draftQuests: Quest[] = [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Мои квесты
          </h1>
          <p className="text-slate-600">
            Управляйте своими активными и завершёнными квестами
          </p>
        </div>

        {/* Офлайн-индикатор */}
        {!isOnlineState && (
          <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Офлайн-режим</span> — данные загружаются из локального хранилища
            </p>
          </div>
        )}

        {/* Вкладки */}
        <QuestTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeQuestsWithProgress.length}
          completedCount={completedQuestsWithProgress.length}
          draftsCount={draftQuests.length}
        />

        {/* Контент вкладок */}
        <div className="mt-6">
          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeQuestsWithProgress.length > 0 ? (
                activeQuestsWithProgress.map(({ quest, progress }) => (
                  <ActiveQuestCard
                    key={quest.id}
                    quest={quest}
                    progress={progress}
                    isOnline={isOnlineState}
                  />
                ))
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Нет активных квестов"
                  description="Начните новый квест, чтобы увидеть его здесь"
                  actionLabel="Найти квесты"
                  actionHref="/quest"
                />
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedQuestsWithProgress.length > 0 ? (
                completedQuestsWithProgress.map(({ quest, progress }) => (
                  <CompletedQuestCard
                    key={quest.id}
                    quest={quest}
                    progress={progress}
                  />
                ))
              ) : (
                <EmptyState
                  icon={Trophy}
                  title="Нет завершённых квестов"
                  description="Завершите квест, чтобы увидеть его здесь"
                  actionLabel="Найти квесты"
                  actionHref="/quest"
                />
              )}
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="space-y-4">
              {draftQuests.length > 0 ? (
                draftQuests.map((quest) => (
                  <DraftQuestCard key={quest.id} quest={quest} />
                ))
              ) : (
                <EmptyState
                  icon={FileEdit}
                  title="Нет черновиков"
                  description="Создайте черновик квеста, чтобы увидеть его здесь"
                  actionLabel="Создать квест"
                  actionHref="/quest/create"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

