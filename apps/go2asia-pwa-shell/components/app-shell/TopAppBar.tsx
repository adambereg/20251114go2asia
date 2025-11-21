'use client';

import { useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useAuthMode } from '../../contexts/AuthModeContext';
import { TopAppBar as UITopAppBar } from '@go2asia/ui';

export function TopAppBar() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { isAuthenticated: devModeAuthenticated } = useAuthMode();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // В development режиме используем переключатель, в production - реальный Clerk
  const isAuthenticated =
    process.env.NODE_ENV === 'production' ? isSignedIn : devModeAuthenticated;

  // Mock данные пользователя для development режима
  const mockUser = {
    initials: 'ИП',
    name: 'Иван Петров',
    email: 'ivan@example.com',
  };

  if (process.env.NODE_ENV === 'production' && !isLoaded) {
    return null;
  }

  const userData =
    process.env.NODE_ENV === 'production'
      ? isSignedIn && user
        ? {
            initials: getInitials(user.fullName || user.firstName),
            name: user.fullName || user.firstName || 'Пользователь',
            email: user.primaryEmailAddress?.emailAddress || '',
          }
        : undefined
      : isAuthenticated
        ? mockUser
        : undefined;

  const topAppBar = (
    <UITopAppBar
      onMenuClick={() => {
        // TODO: открыть меню модулей
      }}
      onHomeClick={() => router.push('/')}
      onSearchClick={() => {
        // TODO: открыть поиск
      }}
      onAuthClick={() => {
        // Clerk обработает через SignInButton wrapper
      }}
      onProfileClick={() => {
        router.push('/profile');
      }}
      user={userData}
    />
  );

  // В production оборачиваем в SignInButton для Clerk
  if (process.env.NODE_ENV === 'production') {
    return <SignInButton mode="modal">{topAppBar}</SignInButton>;
  }

  return topAppBar;
}
