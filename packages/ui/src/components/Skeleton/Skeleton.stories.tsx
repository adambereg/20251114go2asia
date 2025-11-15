import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, SkeletonCard } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Design System/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Скелетоны показываются во время загрузки данных. Соответствуют Style Guide v1.1.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
      description: 'Вариант скелетона',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    className: 'h-4 w-full',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    className: 'h-12 w-12',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    className: 'h-32 w-full',
  },
};

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2 w-full max-w-md">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Несколько строк текста',
      },
    },
  },
};

export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="h-12 w-12" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  ),
};

export const Card: Story = {
  render: () => <SkeletonCard />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Готовый скелетон карточки',
      },
    },
  },
};

export const List: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Список карточек в состоянии загрузки',
      },
    },
  },
};

