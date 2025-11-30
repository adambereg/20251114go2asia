import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Уровни и достижения | Connect Asia | Go2Asia',
  description: 'Отслеживайте свой уровень, XP и достижения',
};

export default function LevelsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Уровни и достижения
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Скоро здесь появится отслеживание вашего уровня,
        XP и достижений в Connect Asia.
      </p>
    </main>
  );
}

