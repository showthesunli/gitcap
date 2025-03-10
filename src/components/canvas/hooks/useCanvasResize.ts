import { useState, useCallback, useEffect, RefObject } from "react";
import Konva from "konva";
import { useEditorStore } from "@/lib/business/editorStore";

interface UseCanvasResizeProps {
  stageRef: RefObject<Konva.Stage>;
}

export function useCanvasResize({ stageRef }: UseCanvasResizeProps) {
  const { setCanvasSize, resizeWithAspectRatio, aspectRatioLocked, isCapturing, isRecording } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [resizeTooltip, setResizeTooltip] = useState("");

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
    [isDragging, stageRef, aspectRatioLocked, resizeWithAspectRatio, setCanvasSize]
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

  return {
    isDragging,
    resizeTooltip,
    handleResizeDragStart,
    handleResizeDragEnd
  };
}
