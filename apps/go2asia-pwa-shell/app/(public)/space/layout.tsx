import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Space Asia | Go2Asia',
  description:
    'Социальная сеть Go2Asia. Делитесь опытом, общайтесь с сообществом, находите единомышленников в Азии.',
  openGraph: {
    title: 'Space Asia | Go2Asia',
    description: 'Социальная сеть для русскоязычных в Азии',
    type: 'website',
  },
};

export default function SpaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

