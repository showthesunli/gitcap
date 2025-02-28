import { Stage, Layer, Rect } from "react-konva";
import { cn } from "@/lib/utils";

interface CanvasContainerProps {
  width: number;
  height: number;
}

export function CanvasContainer({ width, height }: CanvasContainerProps) {
  return (
    <div className="flex-1 bg-card flex items-center justify-center">
      <Stage
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
        className={cn(
          "border-2 border-dashed border-muted rounded-lg",
          "transition-[border-color] duration-300 hover:border-primary/50"
        )}
      >
        <Layer>
          <Rect 
            width={width}
            height={height}
            fill="#ffffff"
          />
        </Layer>
      </Stage>
    </div>
  );
}
