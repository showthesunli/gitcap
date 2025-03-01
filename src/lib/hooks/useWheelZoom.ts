/**
 * @file useWheelZoom.ts
 * @description 鼠标滚轮缩放功能的自定义钩子
 */

import Konva from "konva";

/**
 * 处理鼠标滚轮缩放的事件处理函数
 * @remarks 提供以鼠标为中心点的缩放功能
 * @param options - 缩放选项
 * @returns 滚轮事件处理函数
 */
export const useWheelZoom = (options?: {
  minScale?: number;
  maxScale?: number;
  scaleBy?: number;
}) => {
  const { 
    minScale = 0.1, 
    maxScale = 10, 
    scaleBy = 1.1 
  } = options || {};

  /**
   * 处理鼠标滚轮事件
   * @param e - Konva 滚轮事件对象
   */
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // 阻止默认行为（页面滚动）
    e.evt.preventDefault();
    
    const image = e.target as Konva.Image;
    if (!image) return;

    const stage = image.getStage();
    if (!stage) return;
    
    // 获取当前缩放值
    const oldScale = image.scaleX();

    // 获取鼠标相对于舞台的位置
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // 计算鼠标相对于图像的位置
    const mousePointTo = {
      x: (pointer.x - image.x()) / oldScale,
      y: (pointer.y - image.y()) / oldScale,
    };

    // 确定缩放方向：向上滚动为放大，向下滚动为缩小
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // 限制缩放范围，防止过度缩放或缩小
    const limitedScale = Math.max(minScale, Math.min(newScale, maxScale));

    // 应用新的缩放比例
    image.scale({ x: limitedScale, y: limitedScale });

    // 调整位置，使缩放以鼠标位置为中心
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };
    
    image.position(newPos);
    
    // 重绘图层
    image.getLayer()?.batchDraw();
  };

  return handleWheel;
};
