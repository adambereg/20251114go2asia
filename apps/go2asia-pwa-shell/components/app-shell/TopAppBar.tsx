'use client';

import { useRouter } from 'next/navigation';
import { TopAppBar as UITopAppBar } from '@go2asia/ui';

export function TopAppBar() {
  const router = useRouter();

  return (
    <UITopAppBar
      onMenuClick={() => {
        // TODO: открыть меню модулей
      }}
      onHomeClick={() => router.push('/')}
      onSearchClick={() => {
        // TODO: открыть поиск
      }}
      onAuthClick={() => {
        // TODO: открыть авторизацию
      }}
      onProfileClick={() => {
        // TODO: открыть профиль
      }}
    />
  );
}
