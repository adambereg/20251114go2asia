'use client';

import { useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import { TopAppBar as UITopAppBar } from '@go2asia/ui';

export function TopAppBar() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SignInButton mode="modal">
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
        user={
          isSignedIn && user
            ? {
                initials: getInitials(user.fullName || user.firstName),
                name: user.fullName || user.firstName || 'Пользователь',
                email: user.primaryEmailAddress?.emailAddress || '',
              }
            : undefined
        }
      />
    </SignInButton>
  );
}
