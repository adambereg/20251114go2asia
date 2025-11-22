import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { MessageSquare, MapPin, Calendar, Users } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Design System/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Пустые состояния показываются, когда нет данных для отображения. Соответствуют Style Guide v1.1.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Заголовок пустого состояния',
    },
    description: {
      control: 'text',
      description: 'Описание',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  args: {
    title: 'Пока нет данных',
    description: 'Здесь будет отображаться контент, когда он появится',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <MessageSquare size={32} />,
    title: 'Пока нет постов',
    description: 'Станьте первым, кто поделится опытом',
  },
};

export const WithAction: Story = {
  args: {
    icon: <MessageSquare size={32} />,
    title: 'Пока нет постов',
    description: 'Станьте первым, кто поделится опытом',
    action: {
      label: 'Создать пост',
      onClick: () => console.log('Создать пост'),
    },
  },
};

export const NoPlaces: Story = {
  args: {
    icon: <MapPin size={32} />,
    title: 'Места не найдены',
    description: 'Попробуйте изменить фильтры поиска',
    action: {
      label: 'Сбросить фильтры',
      onClick: () => console.log('Сбросить фильтры'),
    },
  },
};

export const NoEvents: Story = {
  args: {
    icon: <Calendar size={32} />,
    title: 'Нет событий',
    description: 'События появятся здесь, когда они будут добавлены',
  },
};

export const NoUsers: Story = {
  args: {
    icon: <Users size={32} />,
    title: 'Пока нет участников',
    description: 'Пригласите друзей присоединиться',
    action: {
      label: 'Пригласить',
      onClick: () => console.log('Пригласить'),
    },
  },
};

