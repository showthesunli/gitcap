/**
 * 画布底部提示组件
 * @remarks 显示在画布底部的操作提示信息
 */

/**
 * 画布底部提示组件
 * @returns 显示画布操作提示的底部组件
 */
export function CanvasFooter() {
  return (
    <div className="mt-3 text-sm text-muted-foreground flex items-center justify-center">
      <span className="mr-2">💡</span>
      <span>您可以拖动右下角调整预览区域大小</span>
    </div>
  );
}
