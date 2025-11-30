import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Аналитика | Connect Asia | Go2Asia',
  description: 'Отслеживайте эффективность и источники наград',
};

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Аналитика Connect Asia
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Скоро здесь появится отслеживание эффективности
        и источников наград в Connect Asia.
      </p>
    </main>
  );
}
