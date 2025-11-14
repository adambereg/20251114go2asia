import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии | Go2Asia',
  description: 'Исследуйте страны, города и места Юго-Восточной Азии с Go2Asia Atlas',
  openGraph: {
    title: 'Atlas Asia - Путеводитель по Юго-Восточной Азии',
    description: 'Исследуйте страны, города и места Юго-Восточной Азии',
    type: 'website',
  },
};

export default function AtlasPage() {
  return (
    <main>
      <h1>Atlas Asia</h1>
      <p>Путеводитель по Юго-Восточной Азии</p>
    </main>
  );
}

