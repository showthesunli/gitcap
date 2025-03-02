import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore, applyTheme } from '@/lib/business/themeStore'

/**
 * 主题切换按钮
 * @remarks 在暗色模式和亮色模式之间切换
 * @returns 主题切换按钮组件
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggleTheme}
      title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      </span>
    </Button>
  )
}
