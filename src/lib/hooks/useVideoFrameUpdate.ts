/**
 * @file useVideoFrameUpdate.ts
 * @description 用于更新视频帧的自定义钩子
 */

import { useEffect } from "react";
import Konva from "konva";

/**
 * 处理视频元素帧更新的自定义钩子
 * @remarks 使用 requestAnimationFrame 循环更新 Konva 图像
 * @param imageRef - Konva 图像的引用
 */
export const useVideoFrameUpdate = (imageRef: React.RefObject<Konva.Image>) => {
  useEffect(() => {
    if (!imageRef.current) return;

    let animationFrameId: number;

    // 创建动画循环函数
    const updateImage = () => {
      // 确保图像层更新
      if (imageRef.current && imageRef.current.getLayer()) {
        imageRef.current.getLayer()?.batchDraw();
      }
      animationFrameId = requestAnimationFrame(updateImage);
    };

    // 启动动画循环
    animationFrameId = requestAnimationFrame(updateImage);

    // 清理函数
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageRef]);
};
