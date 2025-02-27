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
    <div className="relative h-screen">
      {/* Canvas 区域占据整个屏幕 */}
      <div className="h-full bg-white p-6">
        <div className="w-full h-full flex justify-center items-center">
          <canvas
            width="1080"
            height="720"
            className="border-2 border-slate-200 rounded-lg shadow-sm"
            id="c"
          ></canvas>
        </div>
      </div>

      {/* 工具栏定位在屏幕中央 */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Toolbar 
          items={toolbarItems} 
          className="rounded-lg shadow-md bg-white border border-gray-200"
        />
      </div>
    </div>
  );
}

export default App;
