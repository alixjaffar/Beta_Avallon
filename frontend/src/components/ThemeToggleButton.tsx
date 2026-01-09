import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleButtonProps {
  className?: string;
}

export function ThemeToggleButton({ className = '' }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center size-9 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-panel-border text-slate-600 dark:text-slate-300 transition-colors ${className}`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-[20px]">light_mode</span>
      ) : (
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      )}
    </button>
  );
}
