import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage } = useTheme();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-fadeIn"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--accent-cyan)]/45 text-[var(--text-primary)] shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl text-xs font-medium font-body tracking-tight">
        <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
