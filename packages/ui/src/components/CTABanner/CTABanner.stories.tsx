import type { Meta, StoryObj } from '@storybook/react';
import { CTABanner } from './CTABanner';

const meta: Meta<typeof CTABanner> = {
  title: 'Components/CTABanner',
  component: CTABanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CTABanner>;

export const Default: Story = {
  args: {
    title: 'Присоединяйтесь к сообществу',
    description:
      'Получите доступ ко всем возможностям экосистемы, зарабатывайте награды и находите единомышленников',
    primaryAction: (
      <button className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium">
        Зарегистрироваться →
      </button>
    ),
    secondaryAction: (
      <button className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all font-medium">
        Узнать больше
      </button>
    ),
  },
};

export const SingleAction: Story = {
  args: {
    title: 'Начните путешествие',
    description: 'Откройте для себя новые места и возможности',
    primaryAction: (
      <button className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium">
        Начать →
      </button>
    ),
  },
};

export const NoActions: Story = {
  args: {
    title: 'Добро пожаловать',
    description: 'Мы рады видеть вас в нашей экосистеме',
  },
};

