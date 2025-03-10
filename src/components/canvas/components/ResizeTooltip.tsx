/**
 * 调整大小提示组件
 * @remarks 在调整画布大小时显示尺寸信息的提示框
 */

interface ResizeTooltipProps {
  /** 提示文本内容 */
  text: string;
}

/**
 * 调整大小提示组件
 * @param text - 要显示的提示文本，通常是尺寸信息
 * @returns 显示尺寸信息的提示框组件
 */
export function ResizeTooltip({ text }: ResizeTooltipProps) {
  // 如果没有文本则不渲染
  if (!text) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
      {text}
    </div>
  );
}
