import { useEffect, useRef } from "react";
import { Video, Camera, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 应用主组件
 * @remarks 包含工具栏和画布两个主要部分
 * @returns 应用主界面
 */
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化Canvas上下文
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      // 初始化白色背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 工具栏区域 */}
      <div className="flex justify-center p-3 bg-background border-b shadow-sm">
        <nav className="flex gap-3">
          <ToolButton icon={Video} text="视频导入" />
          <ToolButton icon={Camera} text="屏幕捕捉" />
          <ToolButton icon={LayoutGrid} text="元素库" />
        </nav>
      </div>

      {/* Canvas画布区域 */}
      <div ref={containerRef} className="flex-1 relative bg-card">
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 w-full h-full",
            "border-2 border-dashed border-muted rounded-lg",
            "transition-[border-color] duration-300 hover:border-primary/50"
          )}
        />
      </div>
    </div>
  );
}

// 工具按钮组件
function ToolButton({
  icon: Icon,
  text
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 group hover:bg-primary/10 hover:shadow-sm"
    >
      <Icon className="w-4 h-4 text-primary" />
      <span className="hidden md:inline-block text-primary/80 group-hover:text-primary">
        {text}
      </span>
    </Button>
  );
}

export default App;
