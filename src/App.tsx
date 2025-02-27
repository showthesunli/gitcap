import { useState } from "react";
import Toolbar, { ToolbarItemProps } from "@/components/Toolbar";

function App() {
  // 当前选中的工具
  const [activeTool, setActiveTool] = useState<string>("选择");

  // 工具栏项目定义
  const toolbarItems: ToolbarItemProps[] = [
    {
      label: "选择",
      onClick: () => setActiveTool("选择"),
      active: activeTool === "选择",
    },
    {
      label: "绘制",
      onClick: () => setActiveTool("绘制"),
      active: activeTool === "绘制",
    },
    {
      label: "擦除",
      onClick: () => setActiveTool("擦除"),
      active: activeTool === "擦除",
    },
    {
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
