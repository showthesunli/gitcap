import { useEffect } from 'react'
import { useThemeStore, applyTheme } from '@/lib/business/themeStore'

/**
 * 主题提供者组件
 * @remarks 管理应用的暗色/亮色主题，并监听系统主题变化
 * @returns 包含主题上下文的Provider
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  // 初始化主题和系统主题变化监听
  useEffect(() => {
    // 应用当前主题
    applyTheme(theme)

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return <>{children}</>
}
