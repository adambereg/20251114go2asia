import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect Asia | Экономика и геймификация | Go2Asia',
  description:
    'Центр экономики и геймификации Go2Asia. Отслеживайте балансы Points и G2A, выполняйте миссии, получайте достижения и NFT бейджи.',
  openGraph: {
    title: 'Connect Asia | Экономика и геймификация | Go2Asia',
    description: 'Центр мотивации и наград экосистемы Go2Asia',
    type: 'website',
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

