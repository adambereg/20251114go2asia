import type { Metadata } from 'next';
import { TopicHubView } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Темы Atlas Asia',
  description:
    'Тематические хабы Atlas Asia: визы, налоги, образование, медицина, связь и другие ключевые вопросы жизни в ЮВА.',
};

export default function ThemesIndexPage() {
  return (
    <TopicHubView
      title="Темы Atlas Asia"
      description="Собраны ключевые темы переезда и жизни в Юго-Восточной Азии: визы, налоги, образование, медицина, Russian Friendly и другие."
      sections={[
        {
          id: 'visas',
          title: 'Визы и миграция',
          description: 'Типы виз, правила въезда, риски и обновления регламентов.',
        },
        {
          id: 'taxes',
          title: 'Налоги и работа',
          description: 'Фриланс, удалёнка, бизнес-структуры и базовые налоговые режимы.',
        },
        {
          id: 'education',
          title: 'Образование и дети',
          description: 'Школы, садики, курсы и семейные сценарии переезда.',
        },
      ]}
    />
  );
}


