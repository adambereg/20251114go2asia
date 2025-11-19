import type { Meta, StoryObj } from '@storybook/react';
import { EventCard } from './EventCard';

const meta: Meta<typeof EventCard> = {
  title: 'Components/EventCard',
  component: EventCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {
    date: '23 ноября',
    location: 'Бангкок',
    title: 'Meetup цифровых кочевников',
  },
};

export const WithImage: Story = {
  args: {
    date: '24 ноября',
    location: 'Чиангмай',
    title: 'Йога и медитация на рассвете',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  },
};

export const WithoutLocation: Story = {
  args: {
    date: '25 ноября',
    title: 'Фестиваль уличной еды',
  },
};

