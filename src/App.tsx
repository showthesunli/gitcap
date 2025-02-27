import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* 顶部工具栏 */}
      <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            绘制
          </Button>
          <Button variant="outline" size="sm">
            选择
          </Button>
          <Button variant="outline" size="sm">
            擦除
          </Button>
          <Button variant="outline" size="sm">
            清空
          </Button>
        </div>
      </div>

      {/* 下方 Canvas 区域 */}
      <div className="flex-grow overflow-hidden">
        <canvas className="w-full h-full"></canvas>
      </div>
    </div>
  );
}

export default App;
