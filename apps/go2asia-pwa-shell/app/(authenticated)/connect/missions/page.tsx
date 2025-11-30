import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Миссии | Connect Asia | Go2Asia',
  description: 'Выполняйте задания и получайте награды',
};

export default function MissionsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Миссии Connect Asia
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Скоро здесь появится выполнение заданий
        и получение наград в Connect Asia.
      </p>
    </main>
  );
}
