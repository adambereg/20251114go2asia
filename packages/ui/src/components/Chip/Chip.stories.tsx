import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { useState } from 'react';

const meta: Meta<typeof Chip> = {
  title: 'Design System/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Чипы используются для фильтров, тегов и выбора опций. Соответствуют Style Guide v1.1.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'boolean',
      description: 'Выбранное состояние',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Размер чипа',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    children: 'Фильтр',
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: 'Выбранный',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Маленький',
  },
};

export const WithRemove: Story = {
  args: {
    children: 'С удалением',
    onRemove: () => console.log('Удалено'),
  },
};

export const FilterGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('all');
    return (
      <div className="flex gap-2">
        <Chip
          selected={selected === 'all'}
          onClick={() => setSelected('all')}
        >
          Все
        </Chip>
        <Chip
          selected={selected === 'new'}
          onClick={() => setSelected('new')}
        >
          Новые
        </Chip>
        <Chip
          selected={selected === 'popular'}
          onClick={() => setSelected('popular')}
        >
          Популярные
        </Chip>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример группы фильтров с состоянием',
      },
    },
  },
};

export const Tags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      <Chip onRemove={() => {}}>Таиланд</Chip>
      <Chip onRemove={() => {}}>Бангкок</Chip>
      <Chip onRemove={() => {}}>Кафе</Chip>
      <Chip onRemove={() => {}}>Wi-Fi</Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Пример использования как тегов с возможностью удаления',
      },
    },
  },
};

