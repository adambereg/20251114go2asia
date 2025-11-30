import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard | Connect Asia | Go2Asia',
  description: 'Центр экономики и геймификации Go2Asia',
};

export default function ConnectPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Connect Asia Dashboard
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Скоро здесь появится центр экономики
        и геймификации Go2Asia.
      </p>
    </main>
  );
}
