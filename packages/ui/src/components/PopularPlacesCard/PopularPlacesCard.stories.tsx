import type { Meta, StoryObj } from '@storybook/react';
import { PopularPlacesCard } from './PopularPlacesCard';

const meta: Meta<typeof PopularPlacesCard> = {
  title: 'Components/PopularPlacesCard',
  component: PopularPlacesCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PopularPlacesCard>;

export const Country: Story = {
  args: {
    type: 'Страна',
    name: 'Бангкок',
    country: 'Таиланд',
  },
};

export const City: Story = {
  args: {
    type: 'Город',
    name: 'Чиангмай',
    country: 'Таиланд',
  },
};

export const Island: Story = {
  args: {
    type: 'Остров',
    name: 'Бали',
    country: 'Индонезия',
  },
};

export const WithImage: Story = {
  args: {
    type: 'Город',
    name: 'Пхукет',
    country: 'Таиланд',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
    imageAlt: 'Phuket beach',
  },
};

