import { useEffect, useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { cn } from "@/lib/utils";

interface CanvasContainerProps {
  width: number;
  height: number;
}

export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current;
      const layer = stage.getLayers()[0];
      
      layer.destroyChildren();
      layer.add(
        new Rect({
          width,
          height,
          fill: "#ffffff"
        })
      );
      layer.draw();
    }
  }, [width, height]);

  return (
    <div className="flex-1 bg-card flex items-center justify-center">
      <Stage
        ref={stageRef}
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
        <Layer />
      </Stage>
    </div>
  );
}
