import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';
import { Button } from '../Button';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    primaryAction: (
      <Button className="bg-white text-sky-600 hover:bg-sky-50">
        Зарегистрироваться →
      </Button>
    ),
    secondaryAction: (
      <Button variant="ghost" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
        Посмотреть контент
      </Button>
    ),
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Добро пожаловать',
    subtitle: 'В Go2Asia',
    primaryAction: (
      <Button className="bg-white text-sky-600 hover:bg-sky-50">
        Начать →
      </Button>
    ),
  },
};

