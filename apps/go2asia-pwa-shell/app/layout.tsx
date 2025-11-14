import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Go2Asia - Экосистема путешествий в Юго-Восточной Азии',
  description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

