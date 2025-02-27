/**
 * 纯函数实现的缩放比例计算器
 * @param currentZoom 当前缩放比例
 * @param delta 滚轮滚动量（通常来自 deltaY）
 * @returns 限制在 [0.01, 20] 范围内的新缩放比例
 * 
 * 采用指数衰减模型实现平滑缩放：0.999^delta 近似线性变化
 * 当 delta > 0 时缩小，delta < 0 时放大
 */
export const calculateZoom = (currentZoom: number, delta: number): number => {
  const newZoom = currentZoom * (0.999 ** delta);
  return Math.min(Math.max(newZoom, 0.01), 20); // 钳制缩放范围
};
