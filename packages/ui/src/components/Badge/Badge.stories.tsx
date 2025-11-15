import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { CheckCircle2, Star, MapPin } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Бейджи используются для отображения статусов, категорий и меток. Все варианты соответствуют Style Guide v1.1.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'ugc',
        'verified',
        'editor',
        'russian-friendly',
        'new',
        'popular',
        'prices',
        'dates',
        'photos',
        'info',
      ],
      description: 'Вариант бейджа из Style Guide',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Размер бейджа',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const UGC: Story = {
  args: {
    variant: 'ugc',
    children: 'UGC',
  },
};

export const Verified: Story = {
  args: {
    variant: 'verified',
    icon: <CheckCircle2 size={12} />,
    children: 'Проверено',
  },
};

export const Editor: Story = {
  args: {
    variant: 'editor',
    children: 'Редакция',
  },
};

export const RussianFriendly: Story = {
  args: {
    variant: 'russian-friendly',
    children: 'Russian Friendly',
  },
};

export const New: Story = {
  args: {
    variant: 'new',
    children: 'Новое',
  },
};

export const Popular: Story = {
  args: {
    variant: 'popular',
    icon: <Star size={12} />,
    children: 'Популярное',
  },
};

export const Prices: Story = {
  args: {
    variant: 'prices',
    children: 'Есть цены',
  },
};

export const Dates: Story = {
  args: {
    variant: 'dates',
    children: 'Есть даты',
  },
};

export const Photos: Story = {
  args: {
    variant: 'photos',
    children: 'Есть фото',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Информация',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'verified',
    icon: <CheckCircle2 size={12} />,
    children: 'Проверено редакцией',
  },
};

export const Small: Story = {
  args: {
    variant: 'ugc',
    size: 'sm',
    children: 'UGC',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="ugc">UGC</Badge>
      <Badge variant="verified" icon={<CheckCircle2 size={12} />}>
        Проверено
      </Badge>
      <Badge variant="editor">Редакция</Badge>
      <Badge variant="russian-friendly">Russian Friendly</Badge>
      <Badge variant="new">Новое</Badge>
      <Badge variant="popular" icon={<Star size={12} />}>
        Популярное
      </Badge>
      <Badge variant="prices">Есть цены</Badge>
      <Badge variant="dates">Есть даты</Badge>
      <Badge variant="photos">Есть фото</Badge>
      <Badge variant="info">Информация</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Все варианты бейджей из Style Guide v1.1',
      },
    },
  },
};

