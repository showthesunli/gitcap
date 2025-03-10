/**
 * 画布头部组件
 * @remarks 显示在画布顶部的标题和说明信息
 */

/**
 * 画布头部组件
 * @returns 显示画布标题和说明的头部组件
 */
export function CanvasHeader() {
  return (
    <div className="mb-3 text-center">
      <h3 className="text-lg font-medium mb-1">预览区域</h3>
      <p className="text-sm text-muted-foreground">
        当前显示屏幕捕获内容，可通过工具栏调整参数
      </p>
    </div>
  );
}
