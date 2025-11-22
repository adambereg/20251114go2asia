import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Карточки используются для группировки контента. Все стили соответствуют Style Guide v1.1.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hover: {
      control: 'boolean',
      description: 'Эффект поднятия при наведении',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Простая карточка с контентом</p>
      </CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-xl md:text-2xl font-bold">Заголовок карточки</h3>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600">
          Контент карточки с описанием или другой информацией.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p className="text-slate-600">Контент карточки</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">
          Действие
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-bold">Название места</h3>
          <Badge variant="verified">Проверено</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 mb-4">
          Описание места или другого контента в карточке.
        </p>
        <div className="flex gap-2">
          <Badge variant="prices">Есть цены</Badge>
          <Badge variant="dates">Есть даты</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2 w-full">
          <Button variant="primary" size="sm" className="flex-1">
            Подробнее
          </Button>
          <Button variant="ghost" size="sm">
            Сохранить
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const Hover: Story = {
  render: () => (
    <Card hover>
      <CardContent>
        <p>Карточка с эффектом поднятия при наведении</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Используется для интерактивных карточек (ссылки, клики)',
      },
    },
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} hover>
          <CardContent className="p-4">
            <div className="aspect-square bg-slate-200 rounded-lg mb-3"></div>
            <h4 className="font-semibold mb-1">Карточка {i}</h4>
            <p className="text-sm text-slate-600">Описание</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Пример использования карточек в сетке',
      },
    },
  },
};

