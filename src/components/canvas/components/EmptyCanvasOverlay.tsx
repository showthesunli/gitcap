interface EmptyCanvasOverlayProps {
  isVisible: boolean;
}

export function EmptyCanvasOverlay({ isVisible }: EmptyCanvasOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
      <p className="text-muted-foreground text-center px-4">
        未检测到屏幕捕获
        <br />
        请使用工具栏中的捕获按钮开始
      </p>
    </div>
  );
}
