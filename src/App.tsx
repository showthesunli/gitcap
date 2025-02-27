import { useState } from "react";
import Toolbar, { ToolbarItemProps } from "@/components/Toolbar";
import { MousePointer, Pencil, Eraser, Trash } from "lucide-react";

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
    <div className="relative h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 工具栏定位在顶部中央 */}
      <div className="absolute left-1/2 top-4 transform -translate-x-1/2 z-10">
        <Toolbar
          items={toolbarItems}
          className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100"
        />
      </div>

      {/* Canvas 区域 */}
      <div className="h-full w-full flex justify-center items-center p-6">
        {/* Canvas 元素 */}
        <canvas
          width="1080"
          height="720"
          className="relative z-0 w-full h-full rounded-xl border-2 border-slate-300/50 shadow-[0_10px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm"
          id="c"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default App;
