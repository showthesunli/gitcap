import { useRef, useEffect, useState, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import { cn } from "@/lib/utils";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useKonvaImageUpdater } from "./hooks/useKonvaImageUpdater";
import { VideoCapture } from "@/components/canvas/components/VideoCapture";
import { useEditorStore } from "@/lib/business/editorStore";
import Konva from "konva";
import { useWheelZoom } from "@/lib/hooks/useWheelZoom";

interface CanvasContainerProps {
  width: number;
  height: number;
}

export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { videoElement } = useScreenCapture();
  const { handleImageRef } = useKonvaImageUpdater(videoElement);
  const {
    setStageRef,
    setCanvasSize,
    resizeWithAspectRatio,
    aspectRatioLocked,
    isCapturing,
    isRecording,
  } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeTooltip, setResizeTooltip] = useState("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const { handleWheel } = useWheelZoom({
    minScale: 0.1,
    maxScale: 5,
    scaleBy: 1.1,
  });

  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }

    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  useEffect(() => {
    if (videoElement) {
      const videoWidth = videoElement.videoWidth || width;
      const videoHeight = videoElement.videoHeight || height;

      const scaleX = width / videoWidth;
      const scaleY = height / videoHeight;
      const newScale = Math.min(scaleX, scaleY, 1);

      const newX = (width - videoWidth * newScale) / 2;
      const newY = (height - videoHeight * newScale) / 2;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  }, [videoElement, width, height]);

  const onCaptureEnded = () => {
    console.log("屏幕捕获已结束");
  };

  const handleResizeDragStart = (e: React.MouseEvent) => {
    if (isCapturing || isRecording) return;

    setIsDragging(true);
    document.body.style.cursor = "se-resize";
    e.stopPropagation();
    e.preventDefault();
  };

  const handleResizeDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = stageRef.current?.container();
      if (!container) return;

      const rect = container.getBoundingClientRect();

      const newWidth = Math.max(100, Math.round(e.clientX - rect.left));
      const newHeight = Math.max(100, Math.round(e.clientY - rect.top));

      let finalSize;
      if (aspectRatioLocked) {
        finalSize = resizeWithAspectRatio({ width: newWidth });
      } else {
        finalSize = { width: newWidth, height: newHeight };
      }

      setResizeTooltip(`${finalSize.width} × ${finalSize.height}`);
      setCanvasSize(finalSize);
    },
    [
      isDragging,
      stageRef,
      aspectRatioLocked,
      resizeWithAspectRatio,
      setResizeTooltip,
      setCanvasSize,
    ]
  );

  const handleResizeDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
    setTimeout(() => setResizeTooltip(""), 500);
  };

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => handleResizeDragMove(e);
    const upHandler = () => handleResizeDragEnd();

    if (isDragging) {
      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    }

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
    };
  }, [isDragging, handleResizeDragMove]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-medium mb-1">预览区域</h3>
        <p className="text-sm text-muted-foreground">
          当前显示屏幕捕获内容，可通过工具栏调整参数
        </p>
      </div>

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

        <div
          className={cn(
            "absolute bottom-0 right-0 w-5 h-5 border rounded-full transform translate-x-1/2 translate-y-1/2 shadow-md z-10",
            "transition-colors duration-200",
            isDragging
              ? "bg-primary border-primary"
              : "bg-white border-gray-300 hover:bg-primary/20 hover:border-primary/50",
            isCapturing || isRecording
              ? "opacity-40 cursor-not-allowed"
              : "opacity-100 cursor-se-resize"
          )}
          onMouseDown={handleResizeDragStart}
          title={
            isCapturing || isRecording
              ? "录制或捕获过程中无法调整大小"
              : "拖动调整大小"
          }
        />

        {resizeTooltip && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {resizeTooltip}
          </div>
        )}

        {!videoElement && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
            <p className="text-muted-foreground text-center px-4">
              未检测到屏幕捕获
              <br />
              请使用工具栏中的捕获按钮开始
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 text-sm text-muted-foreground flex items-center justify-center">
        <span className="mr-2">💡</span>
        <span>您可以拖动右下角调整预览区域大小</span>
      </div>
    </div>
  );
}
