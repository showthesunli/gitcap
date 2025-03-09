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
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      {/* 添加预览区域说明 */}
      <div className="mb-3 text-center">
        <h3 className="text-lg font-medium mb-1">预览区域</h3>
        <p className="text-sm text-muted-foreground">当前显示屏幕捕获内容，可通过工具栏调整参数</p>
      </div>
      
      {/* 创建一个带阴影和边框的画布容器，优化样式 */}
      <div
        className="bg-card rounded-lg shadow-lg border border-border/50 p-5 overflow-auto relative"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
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
            "transition-all duration-300 hover:border-primary/50"
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
        {!videoElement && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
            <p className="text-muted-foreground text-center px-4">
              未检测到屏幕捕获<br />
              请使用工具栏中的捕获按钮开始
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
