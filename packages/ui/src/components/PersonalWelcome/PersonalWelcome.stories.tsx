import type { Meta, StoryObj } from '@storybook/react';
import { PersonalWelcome } from './PersonalWelcome';

const meta: Meta<typeof PersonalWelcome> = {
  title: 'Components/PersonalWelcome',
  component: PersonalWelcome,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PersonalWelcome>;

export const Default: Story = {
  args: {
    userName: 'Анна Петрова',
    currentLocation: 'Паттайя, Таиланд',
    level: 12,
    levelProgress: 75,
    pointsToNextLevel: 335,
    pointsBalance: 3450,
    unfinishedNFTs: 5,
    teamMembers: 7,
    activeQuests: 2,
    onContinueQuest: () => console.log('Продолжить квест'),
    onNewVouchers: () => console.log('Новые ваучеры'),
    onReferralLink: () => console.log('Реферальная ссылка'),
  },
};

export const LowLevel: Story = {
  args: {
    userName: 'Иван Иванов',
    currentLocation: 'Бангкок, Таиланд',
    level: 3,
    levelProgress: 45,
    pointsToNextLevel: 120,
    pointsBalance: 450,
    unfinishedNFTs: 1,
    teamMembers: 2,
    activeQuests: 1,
  },
};

export const HighLevel: Story = {
  args: {
    userName: 'Мария Смирнова',
    currentLocation: 'Чиангмай, Таиланд',
    level: 25,
    levelProgress: 90,
    pointsToNextLevel: 50,
    pointsBalance: 12500,
    unfinishedNFTs: 12,
    teamMembers: 15,
    activeQuests: 5,
  },
};

export const WithoutActions: Story = {
  args: {
    userName: 'Петр Петров',
    currentLocation: 'Пхукет, Таиланд',
    level: 8,
    levelProgress: 60,
    pointsToNextLevel: 200,
    pointsBalance: 1200,
    unfinishedNFTs: 3,
    teamMembers: 4,
    activeQuests: 1,
  },
};

