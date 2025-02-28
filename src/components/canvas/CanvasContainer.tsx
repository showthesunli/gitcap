import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CanvasContainerProps {
  width: number;
  height: number;
}

export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

  }, [width, height]);

  return (
    <div className="flex-1 relative bg-card">
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
        className={cn(
          "absolute inset-0",
          "border-2 border-dashed border-muted rounded-lg",
          "transition-[border-color] duration-300 hover:border-primary/50"
        )}
      />
    </div>
  );
}
