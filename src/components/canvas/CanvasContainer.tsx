import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function CanvasContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
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
  );
}
