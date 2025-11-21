import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './FeatureCard';
import { Users, Gift, TrendingUp, Award, Target, Handshake } from 'lucide-react';

const meta: Meta<typeof FeatureCard> = {
  title: 'Design System/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Карточка преимуществ экосистемы. Использует типографику согласно прототипу Bolt.New: H3 заголовок `text-xl md:text-2xl`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['community', 'teams', 'rf', 'referral', 'rewards', 'quests'],
      description: 'Тип карточки (определяет цветовую схему)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Community: Story = {
  args: {
    type: 'community',
    icon: Users,
    title: 'Живое сообщество Go2Asia',
    description: 'Общайтесь с единомышленниками, делитесь опытом и находите новых друзей в путешествиях по Азии.',
    cta: 'Присоединиться',
    onClick: () => console.log('Community clicked'),
  },
};

export const Referral: Story = {
  args: {
    type: 'referral',
    icon: Handshake,
    title: 'Реферальная программа',
    description: 'Приглашайте друзей и получайте бонусы за каждого нового участника экосистемы.',
    cta: 'Узнать больше',
    onClick: () => console.log('Referral clicked'),
  },
};

export const Quests: Story = {
  args: {
    type: 'quests',
    icon: Target,
    title: 'Открывайте Азию через квесты',
    description: 'Маршруты, челленджи и задания в любимых городах. Выполняйте миссии и получайте бонусы.',
    cta: 'Смотреть квесты',
    onClick: () => console.log('Quests clicked'),
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl">
      <FeatureCard
        type="community"
        icon={Users}
        title="Живое сообщество Go2Asia"
        description="Общайтесь с единомышленниками, делитесь опытом и находите новых друзей в путешествиях по Азии."
        cta="Присоединиться"
        onClick={() => {}}
      />
      <FeatureCard
        type="referral"
        icon={Handshake}
        title="Реферальная программа"
        description="Приглашайте друзей и получайте бонусы за каждого нового участника экосистемы."
        cta="Узнать больше"
        onClick={() => {}}
      />
      <FeatureCard
        type="quests"
        icon={Target}
        title="Открывайте Азию через квесты"
        description="Маршруты, челленджи и задания в любимых городах. Выполняйте миссии и получайте бонусы."
        cta="Смотреть квесты"
        onClick={() => {}}
      />
      <FeatureCard
        type="rewards"
        icon={Award}
        title="Система наград"
        description="Зарабатывайте Points, токены и NFT за активность в экосистеме."
        cta="Посмотреть награды"
        onClick={() => {}}
      />
      <FeatureCard
        type="teams"
        icon={Users}
        title="Команды и группы"
        description="Создавайте команды для совместных путешествий и проектов."
        cta="Создать команду"
        onClick={() => {}}
      />
      <FeatureCard
        type="rf"
        icon={Gift}
        title="Russian Friendly партнёры"
        description="Специальные предложения и скидки от партнёров экосистемы."
        cta="Посмотреть партнёров"
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Grid из всех типов FeatureCard. Типографика: H3 заголовки `text-xl md:text-2xl`.',
      },
    },
  },
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="p-4 bg-slate-100 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">H3 в FeatureCard:</h3>
        <p className="text-xs text-slate-600 mb-2">Классы: `text-xl md:text-2xl font-bold`</p>
        <p className="text-xs text-slate-600">Размеры: 20px (mobile) / 24px (desktop)</p>
      </div>
      <FeatureCard
        type="community"
        icon={Users}
        title="Живое сообщество Go2Asia"
        description="Общайтесь с единомышленниками, делитесь опытом и находите новых друзей в путешествиях по Азии."
        cta="Присоединиться"
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация типографики FeatureCard согласно прототипу Bolt.New',
      },
    },
  },
};

