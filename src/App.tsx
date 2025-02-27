import { useState } from "react";
import Toolbar, { ToolbarItemProps } from "@/components/Toolbar";
import { Cursor, Pencil, Eraser, Trash } from "lucide-react";

function App() {
  // 当前选中的工具
  const [activeTool, setActiveTool] = useState<string>("选择");

  // 工具栏项目定义
  const toolbarItems: ToolbarItemProps[] = [
    {
      icon: <Cursor size={16} />,
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
    <div className="flex flex-col h-screen">
      {/* 顶部工具栏 */}
      <Toolbar items={toolbarItems} />
      
      {/* 下方 Canvas 区域 */}
      <div className="flex-grow overflow-hidden">
        <canvas className="w-full h-full"></canvas>
      </div>
    </div>
  );
}

export default App;
