'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TopAppBar as DesignSystemTopAppBar } from '@go2asia/ui';
import { SideDrawer } from './SideDrawer';

export function TopAppBar() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <DesignSystemTopAppBar
        onHomeClick={() => router.push('/')}
        onMenuClick={() => setIsDrawerOpen(true)}
        onSearchClick={() => {
          // TODO: Implement search
          console.log('Search clicked');
        }}
        onAuthClick={() => {
          // TODO: Implement auth
          console.log('Auth clicked');
        }}
      />
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
