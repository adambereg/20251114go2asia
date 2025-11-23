import type { Metadata } from 'next';
import { ModuleHero } from '@/components/modules';
import { Globe } from 'lucide-react';
import { AtlasMainNav } from '@/modules/atlas';
import { AtlasSearchBar } from '@/modules/atlas';
import { EmptyStateAtlas } from '@/modules/atlas';

export const metadata: Metadata = {
  title: 'Гайды Atlas Asia',
  description:
    'Подборки и маршруты по странам и городам Юго-Восточной Азии: для новичков, путешественников и PRO-спейсеров.',
  openGraph: {
    title: 'Гайды Atlas Asia',
    description: 'Подборки и маршруты по странам и городам Юго-Восточной Азии',
    type: 'website',
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ModuleHero
        icon={Globe}
        title="Atlas Asia"
        description="«Живой» вики-справочник по странам Юго-Восточной Азии с UGC и редакционной поддержкой"
        gradientFrom="from-sky-500"
        gradientTo="to-sky-600"
      />

      {/* Top controls: internal nav + search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <AtlasMainNav />
        <AtlasSearchBar />
      </section>

      {/* Guides Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h2 className="text-h2 md:text-3xl font-bold text-slate-900 mb-6">
          Гайды
        </h2>
        <EmptyStateAtlas
          title="Гайды в разработке"
          description="Подборки и маршруты по странам и городам Юго-Восточной Азии: для новичков, путешественников и PRO-спейсеров."
        />
      </section>
    </div>
  );
}


