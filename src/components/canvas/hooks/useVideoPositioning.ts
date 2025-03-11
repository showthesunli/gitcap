/**
 * 视频定位钩子
 * @remarks 处理视频在画布中的缩放和位置计算
 */

import { useState, useEffect } from "react";
import Konva from "konva";

interface UseVideoPositioningProps {
  /** 视频元素 */
  videoElement: HTMLVideoElement | null;
  /** 画布宽度 */
  canvasWidth: number;
  /** 画布高度 */
  canvasHeight: number;
}

/**
 * 视频定位钩子
 * @param videoElement - 视频DOM元素
 * @param canvasWidth - 画布宽度
 * @param canvasHeight - 画布高度
 * @returns 视频缩放和位置相关的状态和处理函数
 */
export function useVideoPositioning({ 
  videoElement, 
  canvasWidth, 
  canvasHeight 
}: UseVideoPositioningProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 当视频元素或画布尺寸变化时重新计算缩放和位置
  useEffect(() => {
    if (videoElement) {
      // 获取视频尺寸，如果不可用则使用画布尺寸
      const videoWidth = videoElement.videoWidth || canvasWidth;
      const videoHeight = videoElement.videoHeight || canvasHeight;

      // 计算适合画布的缩放比例
      const scaleX = canvasWidth / videoWidth;
      const scaleY = canvasHeight / videoHeight;
      // 取最小值确保视频完全显示在画布内，且不超过原始大小
      const newScale = Math.min(scaleX, scaleY, 1);

      // 计算居中位置 - 确保在任何缩放级别下都居中显示
      const newX = (canvasWidth - videoWidth) / 2;
      const newY = (canvasHeight - videoHeight) / 2;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  }, [videoElement, canvasWidth, canvasHeight]);

  /**
   * 处理视频拖拽结束
   * @param e - Konva鼠标事件
   */
  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent>) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return {
    scale,
    position,
    handleDragEnd
  };
}
