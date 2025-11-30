import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Кошелёк | Connect Asia | Go2Asia',
  description: 'Управляйте балансом Points, G2A токенов и NFT бейджей',
};

export default function WalletPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Кошелёк Connect Asia
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Раздел в разработке. Скоро здесь появится управление балансом Points,
        G2A токенов и NFT бейджей.
      </p>
    </main>
  );
}

