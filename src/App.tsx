import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";

function App() {
  // 创建 canvas 引用
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // 初始化 canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // 创建 fabric.js canvas 实例
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth,
        height: window.innerHeight - 64, // 减去工具栏高度
        backgroundColor: "#f5f5f5"
      });

      // 窗口大小变化时调整 canvas 尺寸
      const handleResize = () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight - 64
          });
        }
      };

      window.addEventListener("resize", handleResize);
      
      // 清理函数
      return () => {
        window.removeEventListener("resize", handleResize);
        fabricCanvasRef.current?.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部工具栏 */}
      <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">绘制</Button>
          <Button variant="outline" size="sm">选择</Button>
          <Button variant="outline" size="sm">擦除</Button>
          <Button variant="outline" size="sm">清空</Button>
        </div>
      </div>
      
      {/* 下方 Canvas 区域 */}
      <div className="flex-grow overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
}

export default App;
