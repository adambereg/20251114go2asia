import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Реферальная программа | Connect Asia | Go2Asia',
  description: 'Приглашайте друзей и партнёров, получайте награды',
};

export default function ReferralsPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Реферальная программа Go2Asia
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел сейчас в разработке. В следующих версиях здесь появится ваша
        статистика, реферальные уровни и вознаграждения.
      </p>
    </main>
  );
}
