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
              <h1 className="text-3xl font-bold text-black">GIF Recorder</h1>
              <p className="text-black opacity-70">捕捉屏幕，创建流畅GIF动画</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* 左侧预览区域 */}
          <div className="preview-area flex-1 flex flex-col items-center justify-center">
            {canvasContainer}
          </div>

          {/* 右侧功能面板 */}
          <div className="drawer-panel panel-gradient rounded-xl shadow-lg p-6 w-full lg:w-80 flex flex-col">
            {toolbar}
          </div>
          
          {/* 移动端的抽屉触发器 - 暂时只添加UI，后续添加功能 */}
          <button className="drawer-trigger fixed bottom-4 right-4 lg:hidden z-10 brand-gradient shadow-lg rounded-full p-4 text-white">
            <span className="lucide lucide-settings" style={{ fontSize: "24px" }}></span>
          </button>
        </div>
      </div>
    </div>
  );
}
