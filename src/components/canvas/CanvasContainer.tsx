/**
 * @file CanvasContainer.tsx
 * @description 画布容器组件，集成屏幕捕获功能
 */

import { useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { cn } from "@/lib/utils";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useKonvaImageUpdater } from "./hooks/useKonvaImageUpdater";
import { VideoCapture } from "./components/VideoCapture";
import { useEditorStore } from "@/lib/business/editorStore";
import Konva from "konva";

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
  const { setStageRef } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);

  // 当 stageRef 可用时，更新到 store
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
    
    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* 创建一个带阴影和边框的画布容器 */}
      <div 
        className="bg-card rounded-lg shadow-lg border border-border/50 p-4 overflow-auto"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
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
          ref={stageRef}
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
    </div>
  );
}
