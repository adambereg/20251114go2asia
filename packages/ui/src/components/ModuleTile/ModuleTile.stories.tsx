import type { Meta, StoryObj } from '@storybook/react';
import { ModuleTile } from './ModuleTile';
import { Globe, Calendar, BookOpen, MapPin, Building, Target, Handshake, Users, Wallet } from 'lucide-react';

const meta: Meta<typeof ModuleTile> = {
  title: 'Design System/ModuleTile',
  component: ModuleTile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Карточка модуля экосистемы. Использует типографику согласно прототипу Bolt.New: H3 заголовок `text-xl md:text-2xl`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    module: {
      control: 'select',
      options: ['atlas', 'pulse', 'blog', 'guru', 'space', 'rielt', 'quest', 'rf', 'connect', 'partner'],
      description: 'Тип модуля (определяет цвет градиента)',
    },
    locked: {
      control: 'boolean',
      description: 'Показывать ли бейдж "После входа"',
    },
    isPro: {
      control: 'boolean',
      description: 'Показывать ли бейдж "PRO"',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModuleTile>;

export const Atlas: Story = {
  args: {
    module: 'atlas',
    icon: Globe,
    title: 'Atlas Asia',
    description: 'Энциклопедия мест',
    locked: false,
    isPro: false,
    onClick: () => console.log('Atlas clicked'),
  },
};

export const Pulse: Story = {
  args: {
    module: 'pulse',
    icon: Calendar,
    title: 'Pulse Asia',
    description: 'События и афиша',
    locked: false,
    isPro: false,
    onClick: () => console.log('Pulse clicked'),
  },
};

export const Blog: Story = {
  args: {
    module: 'blog',
    icon: BookOpen,
    title: 'Blog Asia',
    description: 'Статьи и гайды',
    locked: false,
    isPro: false,
    onClick: () => console.log('Blog clicked'),
  },
};

export const Locked: Story = {
  args: {
    module: 'quest',
    icon: Target,
    title: 'Quest Asia',
    description: 'Квесты и челленджи',
    locked: true,
    isPro: false,
    onClick: () => console.log('Quest clicked'),
  },
};

export const Pro: Story = {
  args: {
    module: 'connect',
    icon: Wallet,
    title: 'Connect Asia',
    description: 'Баланс и награды',
    locked: false,
    isPro: true,
    onClick: () => console.log('Connect clicked'),
  },
};

export const AllModules: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl">
      <ModuleTile
        module="atlas"
        icon={Globe}
        title="Atlas Asia"
        description="Энциклопедия мест"
        onClick={() => {}}
      />
      <ModuleTile
        module="pulse"
        icon={Calendar}
        title="Pulse Asia"
        description="События и афиша"
        onClick={() => {}}
      />
      <ModuleTile
        module="blog"
        icon={BookOpen}
        title="Blog Asia"
        description="Статьи и гайды"
        onClick={() => {}}
      />
      <ModuleTile
        module="guru"
        icon={MapPin}
        title="Guru Asia"
        description="Рядом со мной"
        locked={true}
        onClick={() => {}}
      />
      <ModuleTile
        module="rielt"
        icon={Building}
        title="Rielt.Market"
        description="Поиск жилья"
        locked={true}
        onClick={() => {}}
      />
      <ModuleTile
        module="quest"
        icon={Target}
        title="Quest Asia"
        description="Квесты и челленджи"
        locked={true}
        onClick={() => {}}
      />
      <ModuleTile
        module="rf"
        icon={Handshake}
        title="Russian Friendly"
        description="Партнёры и скидки"
        locked={true}
        onClick={() => {}}
      />
      <ModuleTile
        module="space"
        icon={Users}
        title="Space Asia"
        description="Социальная сеть"
        locked={true}
        onClick={() => {}}
      />
      <ModuleTile
        module="connect"
        icon={Wallet}
        title="Connect Asia"
        description="Баланс и награды"
        locked={true}
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Grid из 9 модулей: 2 колонки на мобильных, 3 колонки на планшетах и десктопах. Типографика: H3 заголовки `text-xl md:text-2xl`.',
      },
    },
  },
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div className="p-4 bg-slate-100 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">H3 в ModuleTile:</h3>
        <p className="text-xs text-slate-600 mb-2">Классы: `text-xl md:text-2xl font-bold`</p>
        <p className="text-xs text-slate-600">Размеры: 20px (mobile) / 24px (desktop)</p>
      </div>
      <ModuleTile
        module="atlas"
        icon={Globe}
        title="Atlas Asia"
        description="Энциклопедия мест"
        onClick={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Демонстрация типографики ModuleTile согласно прототипу Bolt.New',
      },
    },
  },
};

