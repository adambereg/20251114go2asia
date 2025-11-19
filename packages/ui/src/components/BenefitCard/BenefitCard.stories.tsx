import type { Meta, StoryObj } from '@storybook/react';
import { Users2, Gift, TrendingUp, Award, Crosshair } from 'lucide-react';
import { BenefitCard } from './BenefitCard';

const meta: Meta<typeof BenefitCard> = {
  title: 'Components/BenefitCard',
  component: BenefitCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BenefitCard>;

export const Default: Story = {
  args: {
    icon: Users2,
    title: 'Живое сообщество Go2Asia',
    description:
      'Знакомьтесь с людьми, делитесь опытом, находите ответы на любые вопросы о ЮВА.',
    actionText: 'Перейти в Space Asia',
    color: 'blue',
  },
};

export const Green: Story = {
  args: {
    icon: Gift,
    title: 'Скидки у Russian Friendly-партнёров',
    description:
      'Кафе, отели, коворкинги и сервисы, где вас понимают и дают бонусы по Go2Asia.',
    actionText: 'Смотреть партнёрские места',
    color: 'green',
  },
};

export const Yellow: Story = {
  args: {
    icon: TrendingUp,
    title: 'Реферальная программа',
    description:
      'Приглашайте друзей в Go2Asia и получайте вознаграждения за их активность.',
    actionText: 'Получить свою реферальную ссылку',
    color: 'yellow',
  },
};

export const Purple: Story = {
  args: {
    icon: Award,
    title: 'Награды за активность',
    description:
      'Публикуйте посты, проходите квесты, помогайте новичкам и копите Points и NFT-бейджи.',
    actionText: 'Открыть профиль наград',
    color: 'purple',
  },
};

export const Pink: Story = {
  args: {
    icon: Crosshair,
    title: 'Открывайте Азию через квесты',
    description:
      'Маршруты, челленджи и задания в любимых городах. Выполняйте миссии и получайте бонусы.',
    actionText: 'Смотреть квесты',
    color: 'pink',
  },
};

export const WithoutAction: Story = {
  args: {
    icon: Users2,
    title: 'Живое сообщество Go2Asia',
    description:
      'Знакомьтесь с людьми, делитесь опытом, находите ответы на любые вопросы о ЮВА.',
    color: 'blue',
  },
};

