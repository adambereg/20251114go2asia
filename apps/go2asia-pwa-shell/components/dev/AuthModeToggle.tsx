'use client';

import { useAuthMode } from '../../contexts/AuthModeContext';
import { User, UserX } from 'lucide-react';

export function AuthModeToggle() {
  const { authMode, toggleAuthMode, isAuthenticated } = useAuthMode();

  // Показываем только в development режиме
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <button
      onClick={toggleAuthMode}
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-lg transition-all text-sm font-medium"
      title={`Текущий режим: ${isAuthenticated ? 'Авторизован' : 'Не авторизован'}. Нажмите для переключения.`}
      aria-label="Переключить режим авторизации"
    >
      {isAuthenticated ? (
        <>
          <User size={16} />
          <span className="hidden sm:inline">Авторизован</span>
        </>
      ) : (
        <>
          <UserX size={16} />
          <span className="hidden sm:inline">Не авторизован</span>
        </>
      )}
    </button>
  );
}

