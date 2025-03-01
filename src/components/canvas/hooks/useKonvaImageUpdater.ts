/**
 * @file useKonvaImageUpdater.ts
 * @description Konva图像更新的自定义Hook
 */

import { useEffect, useRef } from "react";
import Konva from "konva";

/**
 * 处理Konva图像更新的自定义Hook
 * @remarks 使用requestAnimationFrame持续更新视频帧
 * @param videoElement - 需要渲染的视频元素
 * @returns 图像引用回调函数
 */
export const useKonvaImageUpdater = (videoElement: HTMLVideoElement | null) => {
  const animationFrameRef = useRef<number | null>(null);

  // 更新Konva图像
  const updateImage = (node: Konva.Image) => {
    if (!node || !videoElement) return;
    
    // 强制更新图层
    node.getLayer()?.batchDraw();
    
    // 继续动画循环
    animationFrameRef.current = requestAnimationFrame(() => updateImage(node));
  };

  // 当Konva图像挂载时开始更新循环
  const handleImageRef = (node: Konva.Image) => {
    if (node && videoElement) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => updateImage(node));
    }
  };

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoElement]);

  return { handleImageRef };
};
