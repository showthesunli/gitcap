/**
 * 调整大小手柄组件
 * @remarks 用于调整画布大小的可拖动手柄
 */

import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  /** 是否正在拖动中 */
  isDragging: boolean;
  /** 是否禁用调整大小功能 */
  isDisabled: boolean;
  /** 鼠标按下事件处理函数 */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * 调整大小手柄组件
 * @param isDragging - 是否正在拖动中
 * @param isDisabled - 是否禁用调整大小功能
 * @param onMouseDown - 鼠标按下事件处理函数
 * @returns 可拖动的调整大小手柄组件
 */
export function ResizeHandle({ 
  isDragging, 
  isDisabled, 
  onMouseDown 
}: ResizeHandleProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 w-5 h-5 border rounded-full transform translate-x-1/2 translate-y-1/2 shadow-md z-10",
        "transition-colors duration-200",
        isDragging
          ? "bg-primary border-primary"
          : "bg-white border-gray-300 hover:bg-primary/20 hover:border-primary/50",
        isDisabled
          ? "opacity-40 cursor-not-allowed"
          : "opacity-100 cursor-se-resize"
      )}
      onMouseDown={onMouseDown}
      title={
        isDisabled
          ? "录制或捕获过程中无法调整大小"
          : "拖动调整大小"
      }
    />
  );
}
