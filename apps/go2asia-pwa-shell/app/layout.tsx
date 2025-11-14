import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Go2Asia - Экосистема путешествий в Юго-Восточной Азии',
    template: '%s | Go2Asia',
  },
  description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  keywords: ['путешествия', 'Юго-Восточная Азия', 'Таиланд', 'Вьетнам', 'Индонезия'],
  authors: [{ name: 'Go2Asia Team' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://go2asia.space',
    siteName: 'Go2Asia',
    title: 'Go2Asia - Экосистема путешествий в Юго-Восточной Азии',
    description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go2Asia - Экосистема путешествий',
    description: 'Цифровая экосистема для жизни, путешествий и бизнеса в Юго-Восточной Азии',
  },
  robots: {
    index: true,
    follow: true,
  },
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
