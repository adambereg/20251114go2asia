'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNav as DesignSystemBottomNav } from '@go2asia/ui';

type ModuleType = 'home' | 'atlas' | 'pulse' | 'blog' | 'space';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Определяем активный модуль на основе pathname
  const getActiveModule = (): ModuleType => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/atlas')) return 'atlas';
    if (pathname.startsWith('/pulse')) return 'pulse';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/space')) return 'space';
    return 'home';
  };

  const handleModuleChange = (module: ModuleType) => {
    const routes: Record<ModuleType, string> = {
      home: '/',
      atlas: '/atlas',
      pulse: '/pulse',
      blog: '/blog',
      space: '/space',
    };
    router.push(routes[module]);
  };

  return (
    <DesignSystemBottomNav
      activeModule={getActiveModule()}
      onModuleChange={handleModuleChange}
    />
  );
}
