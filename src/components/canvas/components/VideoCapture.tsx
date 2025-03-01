/**
 * @file VideoCapture.tsx
 * @description 视频捕获的Konva图像组件
 */

import { Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { useEffect, useRef } from "react";

/**
 * 渲染视频捕获的Konva图像组件的属性
 */
interface VideoCaptureProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
  onImageRef: (node: Konva.Image) => void;
}

/**
 * 渲染视频捕获的Konva图像组件
 * @remarks 将视频元素渲染为Konva图像，支持拖拽和缩放
 */
export const VideoCapture = ({
  videoElement,
  width,
  height,
  onImageRef,
}: VideoCaptureProps) => {
  if (!videoElement) return null;

  // 使用ref保存图像实例
  const imageRef = useRef<Konva.Image | null>(null);

  // 计算视频实际尺寸和舞台尺寸的比例，保持视频原始比例
  const videoWidth = videoElement.videoWidth || width;
  const videoHeight = videoElement.videoHeight || height;

  // 计算适合舞台的尺寸，保持视频原始宽高比
  const scaleRatio = Math.min(width / videoWidth, height / videoHeight);

  const scaledWidth = videoWidth * scaleRatio;
  const scaledHeight = videoHeight * scaleRatio;

  // 使用动画循环保持视频内容更新
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
  }, [videoElement]);

  // 处理ref的回调函数
  const handleRef = (node: Konva.Image) => {
    imageRef.current = node;
    onImageRef(node);
  };

  return (
    <KonvaImage
      image={videoElement}
      width={scaledWidth}
      height={scaledHeight}
      draggable={true}
      ref={handleRef}
      // 居中显示
      x={(width - scaledWidth) / 2}
      y={(height - scaledHeight) / 2}
    />
  );
};
