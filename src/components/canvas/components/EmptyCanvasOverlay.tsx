/**
 * 空画布覆盖层组件
 * @remarks 当没有屏幕捕获内容时显示的提示覆盖层
 */

interface EmptyCanvasOverlayProps {
  /** 是否显示覆盖层 */
  isVisible: boolean;
}

/**
 * 空画布覆盖层组件
 * @param isVisible - 控制覆盖层是否可见
 * @returns 当无屏幕捕获内容时显示的提示覆盖层
 */
export function EmptyCanvasOverlay({ isVisible }: EmptyCanvasOverlayProps) {
  // 如果不可见则不渲染任何内容
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
