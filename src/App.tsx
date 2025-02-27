import { useState } from "react";
import Toolbar, { ToolbarItemProps } from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import { MousePointer, Pencil, Eraser, Trash } from "lucide-react";

/**
 * 应用主组件
 * @remarks 包含工具栏和画布两个主要部分
 * @returns 应用主界面
 */
function App() {
  // 当前选中的工具
  const [activeTool, setActiveTool] = useState<string>("选择");

  // 工具栏项目定义
  const toolbarItems: ToolbarItemProps[] = [
    {
      icon: <MousePointer size={16} />,
      label: "选择",
      onClick: () => setActiveTool("选择"),
      active: activeTool === "选择",
    },
    {
      icon: <Pencil size={16} />,
      label: "绘制",
      onClick: () => setActiveTool("绘制"),
      active: activeTool === "绘制",
    },
    {
      icon: <Eraser size={16} />,
      label: "擦除",
      onClick: () => setActiveTool("擦除"),
      active: activeTool === "擦除",
    },
    {
      icon: <Trash size={16} />,
      label: "清空",
      onClick: () => {
        // 清空画布的逻辑
        console.log("清空画布");
      },
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 上部分：工具栏 */}
      <div className="flex justify-center p-4">
        <Toolbar
          items={toolbarItems}
          className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100"
        />
      </div>
      
      {/* 下部分：Canvas */}
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  );
}

export default App;
