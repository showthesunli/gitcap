/**
 * 画布大小调整钩子
 * @remarks 提供画布大小调整功能，包括拖拽调整、保持宽高比等
 */

import { useState, useCallback, useEffect, RefObject } from "react";
import Konva from "konva";
import { useEditorStore } from "@/lib/business/editorStore";

interface UseCanvasResizeProps {
  /** Konva舞台引用 */
  stageRef: RefObject<Konva.Stage>;
}

/**
 * 画布大小调整钩子
 * @param stageRef - Konva舞台引用
 * @returns 画布调整大小相关的状态和处理函数
 */
export function useCanvasResize({ stageRef }: UseCanvasResizeProps) {
  const { setCanvasSize, resizeWithAspectRatio, aspectRatioLocked, isCapturing, isRecording } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [resizeTooltip, setResizeTooltip] = useState("");

  /**
   * 处理调整大小拖拽开始
   * @param e - 鼠标事件
   */
  const handleResizeDragStart = (e: React.MouseEvent) => {
    if (isCapturing || isRecording) return;

    setIsDragging(true);
    document.body.style.cursor = "se-resize";
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * 处理调整大小拖拽移动
   * @param e - 鼠标事件
   */
  const handleResizeDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = stageRef.current?.container();
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // 计算新的宽高，确保最小尺寸为100px
      const newWidth = Math.max(100, Math.round(e.clientX - rect.left));
      const newHeight = Math.max(100, Math.round(e.clientY - rect.top));

      let finalSize;
      if (aspectRatioLocked) {
        // 如果锁定了宽高比，使用保持比例的调整函数
        finalSize = resizeWithAspectRatio({ width: newWidth });
      } else {
        finalSize = { width: newWidth, height: newHeight };
      }

      // 更新提示文本和画布大小
      setResizeTooltip(`${finalSize.width} × ${finalSize.height}`);
      setCanvasSize(finalSize);
    },
    [isDragging, stageRef, aspectRatioLocked, resizeWithAspectRatio, setCanvasSize]
  );

  /**
   * 处理调整大小拖拽结束
   */
  const handleResizeDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
    // 延迟清除提示文本，让用户能看到最终尺寸
    setTimeout(() => setResizeTooltip(""), 500);
  };

  // 添加和移除全局鼠标事件监听
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

  return {
    isDragging,
    resizeTooltip,
    handleResizeDragStart,
    handleResizeDragEnd
  };
}
