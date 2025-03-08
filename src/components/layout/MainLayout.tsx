import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 从children中提取组件
  const [toolbar, canvasContainer] = React.Children.toArray(children);

  return (
    <div className="gradient-bg min-h-screen font-sans overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">GIF Recorder</h1>
              <p className="text-black dark:text-white opacity-70">捕捉屏幕，创建流畅GIF动画</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-row gap-6 relative">
          {/* 左侧预览区域 */}
          <div className="preview-area flex-1 flex flex-col items-center justify-center">
            {canvasContainer}
          </div>

          {/* 右侧面板 - 移除所有响应式类 */}
          <div className="panel-gradient rounded-xl shadow-lg p-6 w-80 flex flex-col">
            {toolbar}
          </div>
        </div>
      </div>
    </div>
  );
}
