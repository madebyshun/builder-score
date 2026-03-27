'use client'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="text-xs border border-current px-3 py-1.5 rounded-lg transition-all opacity-70 hover:opacity-100 font-mono"
      title="Toggle theme"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
