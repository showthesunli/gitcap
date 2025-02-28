import { useState } from "react";
import { Video, Camera, LayoutGrid } from "lucide-react";

/**
 * 应用主组件
 * @remarks 包含工具栏和画布两个主要部分
 * @returns 应用主界面
 */
function App() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 上部分：工具栏 */}
      <div className="flex justify-center p-4"></div>

      {/* 下部分：Canvas */}
      <div className="flex-1"></div>
    </div>
  );
}

export default App;
