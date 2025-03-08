import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings } from "lucide-react"; // 使用 lucide-react 的设置图标

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // 从children中提取组件
  const [toolbar, canvasContainer] = React.Children.toArray(children);
  
  // 只保留抽屉开关状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* 左侧预览区域 */}
          <div className="preview-area flex-1 flex flex-col items-center justify-center">
            {canvasContainer}
          </div>

          {/* 大屏幕时显示的常规面板 - 使用 hidden 和 lg:flex 控制响应式显示 */}
          <div className="drawer-panel panel-gradient rounded-xl shadow-lg p-6 w-full lg:w-80 hidden lg:flex flex-col">
            {toolbar}
          </div>
          
          {/* 小屏幕时使用的抽屉组件 - 使用 lg:hidden 控制响应式显示 */}
          <div className="lg:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="fixed bottom-4 right-4 z-10 brand-gradient shadow-lg rounded-full p-4 text-white">
                  <Settings size={24} />
                </button>
              </DrawerTrigger>
              <DrawerContent className="panel-gradient">
                <div className="p-6">
                  {toolbar}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
