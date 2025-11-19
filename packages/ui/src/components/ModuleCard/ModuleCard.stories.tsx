import type { Meta, StoryObj } from '@storybook/react';
import { ModuleCard } from './ModuleCard';
import { Globe, Calendar, BookOpen, MapPin, Building, Target, Users, Wallet } from 'lucide-react';

const meta: Meta<typeof ModuleCard> = {
  title: 'Components/ModuleCard',
  component: ModuleCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModuleCard>;

export const Atlas: Story = {
  args: {
    icon: Globe,
    title: 'Atlas Asia',
    description: 'Энциклопедия мест',
    color: 'blue',
    requiresAuth: false,
  },
};

export const Pulse: Story = {
  args: {
    icon: Calendar,
    title: 'Pulse Asia',
    description: 'События и афиша',
    color: 'blue',
    requiresAuth: false,
  },
};

export const Blog: Story = {
  args: {
    icon: BookOpen,
    title: 'Blog Asia',
    description: 'Статьи и гайды',
    color: 'blue',
    requiresAuth: false,
  },
};

export const Guru: Story = {
  args: {
    icon: MapPin,
    title: 'Guru Asia',
    description: 'Рядом со мной',
    color: 'green',
    requiresAuth: true,
  },
};

export const Quest: Story = {
  args: {
    icon: Target,
    title: 'Quest Asia',
    description: 'Квесты и челленджи',
    color: 'purple',
    requiresAuth: true,
  },
};

export const Connect: Story = {
  args: {
    icon: Wallet,
    title: 'Connect Asia',
    description: 'Баланс и награды',
    color: 'orange',
    requiresAuth: true,
  },
};

