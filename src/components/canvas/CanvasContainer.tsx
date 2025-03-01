/**
 * @file CanvasContainer.tsx
 * @description 画布容器组件，集成屏幕捕获功能
 */

import { Stage, Layer } from "react-konva";
import { cn } from "@/lib/utils";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useKonvaImageUpdater } from "./hooks/useKonvaImageUpdater";
import { VideoCapture } from "./components/VideoCapture";

/**
 * 画布容器组件属性
 */
interface CanvasContainerProps {
  width: number;
  height: number;
}

/**
 * 画布容器组件
 * @remarks 集成屏幕捕获功能的Konva舞台
 */
export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { videoElement } = useScreenCapture();
  const { handleImageRef } = useKonvaImageUpdater(videoElement);

  return (
    <div className="flex-1 bg-card flex items-center justify-center">
      <Stage
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className={cn(
          "border-2 border-dashed border-muted rounded-lg",
          "transition-[border-color] duration-300 hover:border-primary/50"
        )}
      >
        <Layer>
          <VideoCapture 
            videoElement={videoElement} 
            width={width} 
            height={height} 
            onImageRef={handleImageRef} 
          />
        </Layer>
      </Stage>
    </div>
  );
}
