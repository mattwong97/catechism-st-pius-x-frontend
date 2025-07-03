import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const current = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="p-2 rounded focus:outline-none focus:ring"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
    >
      {current === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
