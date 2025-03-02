import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'theme-store' }
  )
)

// 设置HTML元素上的类名
export function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  
  root.classList.remove('light', 'dark')
  root.classList.add(theme === 'system' ? systemTheme : theme)
}
