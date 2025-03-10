/**
 * 画布容器组件
 * @remarks 负责管理和渲染屏幕捕获的主画布区域，包括视频显示、调整大小和交互功能
 */

import { useRef, useEffect, RefObject } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { cn } from "@/lib/utils";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useKonvaImageUpdater } from "./hooks/useKonvaImageUpdater";
import { useEditorStore } from "@/lib/business/editorStore";
import { useWheelZoom } from "@/lib/hooks/useWheelZoom";
import { useCanvasResize } from "./hooks/useCanvasResize";
import { useVideoPositioning } from "./hooks/useVideoPositioning";

// 导入组件
import { VideoCapture } from "./VideoCapture";
import { ResizeHandle } from "./components/ResizeHandle";
import { CanvasHeader } from "./components/CanvasHeader";
import { CanvasFooter } from "./components/CanvasFooter";
import { EmptyCanvasOverlay } from "./components/EmptyCanvasOverlay";
import { ResizeTooltip } from "./components/ResizeTooltip";

interface CanvasContainerProps {
  /** 画布宽度 */
  width: number;
  /** 画布高度 */
  height: number;
}

/**
 * 画布容器组件
 * @param width - 画布宽度
 * @param height - 画布高度
 * @returns 完整的画布容器，包含视频显示、调整控件和提示信息
 */
export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { videoElement } = useScreenCapture();
  const { handleImageRef } = useKonvaImageUpdater(videoElement);
  const { setStageRef, isCapturing, isRecording } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);

  // 处理视频在画布中的定位和缩放
  const { scale, position, handleDragEnd } = useVideoPositioning({
    videoElement,
    canvasWidth: width,
    canvasHeight: height,
  });

  // 处理画布大小调整功能
  const { isDragging, resizeTooltip, handleResizeDragStart } = useCanvasResize({
    stageRef: stageRef as RefObject<Konva.Stage>,
  });

  // 处理鼠标滚轮缩放功能
  const { handleWheel } = useWheelZoom({
    minScale: 0.1,
    maxScale: 5,
    scaleBy: 1.1,
  });

  // 将Stage引用存储到全局状态
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }

    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  /**
   * 处理屏幕捕获结束事件
   */
  const onCaptureEnded = () => {
    console.log("屏幕捕获已结束");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <CanvasHeader />

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
          onWheel={handleWheel}
        >
          <Layer>
            <VideoCapture
              videoElement={videoElement}
              width={width}
              height={height}
              onImageRef={handleImageRef}
              onCaptureEnded={onCaptureEnded}
              scale={scale}
              x={position.x}
              y={position.y}
              onDragEnd={handleDragEnd}
            />
          </Layer>
        </Stage>

        <ResizeHandle
          isDragging={isDragging}
          isDisabled={isCapturing || isRecording}
          onMouseDown={handleResizeDragStart}
        />

        <ResizeTooltip text={resizeTooltip} />

        <EmptyCanvasOverlay isVisible={!videoElement} />
      </div>

      <CanvasFooter />
    </div>
  );
}
