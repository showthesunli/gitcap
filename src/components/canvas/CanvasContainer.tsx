/**
 * @file CanvasContainer.tsx
 * @description 画布容器组件，集成屏幕捕获功能和拖动调整大小功能
 */

import { useRef, useEffect, useState } from "react";
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
 * @remarks 集成屏幕捕获功能的Konva舞台，支持拖动调整大小
 */
export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { videoElement } = useScreenCapture();
  const { handleImageRef } = useKonvaImageUpdater(videoElement);
  const { setStageRef, setCanvasSize, resizeWithAspectRatio, aspectRatioLocked, isCapturing, isRecording } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeTooltip, setResizeTooltip] = useState("");
  
  // 当 stageRef 可用时，更新到 store
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }

    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  // 处理拖动调整大小事件
  const handleResizeDragStart = (e: React.MouseEvent) => {
    // 如果正在捕获或录制，不允许调整大小
    if (isCapturing || isRecording) return;
    
    setIsDragging(true);
    document.body.style.cursor = 'se-resize';
    // 阻止事件冒泡，防止干扰其他事件
    e.stopPropagation();
    e.preventDefault();
  };

  const handleResizeDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // 获取容器元素
    const container = stageRef.current?.container();
    if (!container) return;
    
    // 获取容器位置
    const rect = container.getBoundingClientRect();
    
    // 计算新尺寸，设置最小值
    let newWidth = Math.max(100, Math.round(e.clientX - rect.left));
    let newHeight = Math.max(100, Math.round(e.clientY - rect.top));
    
    // 应用尺寸变化，考虑宽高比锁定
    let finalSize;
    if (aspectRatioLocked) {
      finalSize = resizeWithAspectRatio({ width: newWidth });
    } else {
      finalSize = { width: newWidth, height: newHeight };
    }
    
    // 更新调整大小提示
    setResizeTooltip(`${finalSize.width} × ${finalSize.height}`);
    
    // 应用新尺寸
    setCanvasSize(finalSize);
  };

  const handleResizeDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    // 隐藏提示
    setTimeout(() => setResizeTooltip(""), 500);
  };

  // 添加和移除事件监听器
  useEffect(() => {
    const moveHandler = (e: MouseEvent) => handleResizeDragMove(e);
    const upHandler = () => handleResizeDragEnd();
    
    if (isDragging) {
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    }
    
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
  }, [isDragging]);

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
        
        {/* 添加调整大小的控制点 */}
        <div 
          className={cn(
            "absolute bottom-0 right-0 w-5 h-5 border rounded-full transform translate-x-1/2 translate-y-1/2 shadow-md z-10",
            "transition-colors duration-200",
            isDragging 
              ? "bg-primary border-primary" 
              : "bg-white border-gray-300 hover:bg-primary/20 hover:border-primary/50",
            (isCapturing || isRecording) 
              ? "opacity-40 cursor-not-allowed" 
              : "opacity-100 cursor-se-resize"
          )}
          onMouseDown={handleResizeDragStart}
          title={isCapturing || isRecording ? "录制或捕获过程中无法调整大小" : "拖动调整大小"}
        />
        
        {/* 添加大小调整提示 */}
        {resizeTooltip && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {resizeTooltip}
          </div>
        )}
        
        {!videoElement && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
            <p className="text-muted-foreground text-center px-4">
              未检测到屏幕捕获<br />
              请使用工具栏中的捕获按钮开始
            </p>
          </div>
        )}
      </div>
      
      {/* 添加使用提示 */}
      <div className="mt-3 text-sm text-muted-foreground flex items-center justify-center">
        <span className="mr-2">💡</span>
        <span>您可以拖动右下角调整预览区域大小</span>
      </div>
    </div>
  );
}
