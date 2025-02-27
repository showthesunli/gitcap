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
        <div className="relative w-[1080px] h-[720px] rounded-xl overflow-hidden">
          {/* 背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl"></div>
          
          {/* Canvas 元素 */}
          <canvas
            width="1080"
            height="720"
            className="relative z-0 w-full h-full rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-gray-100"
            id="c"
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
