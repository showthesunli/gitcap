import { cn } from "@/lib/utils";

interface ResizeHandleProps {
  isDragging: boolean;
  isDisabled: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

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
