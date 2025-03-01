/**
 * @file VideoCapture.tsx
 * @description 视频捕获的Konva图像组件
 */

import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

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
  onImageRef 
}: VideoCaptureProps) => {
  if (!videoElement) return null;
  
  // 计算视频实际尺寸和舞台尺寸的比例，保持视频原始比例
  const videoWidth = videoElement.videoWidth || width;
  const videoHeight = videoElement.videoHeight || height;
  
  // 计算适合舞台的尺寸，保持视频原始宽高比
  const scaleRatio = Math.min(
    width / videoWidth,
    height / videoHeight
  );
  
  const scaledWidth = videoWidth * scaleRatio;
  const scaledHeight = videoHeight * scaleRatio;
  
  return (
    <KonvaImage
      image={videoElement}
      width={scaledWidth}
      height={scaledHeight}
      draggable={true}
      ref={onImageRef}
      // 居中显示
      x={(width - scaledWidth) / 2}
      y={(height - scaledHeight) / 2}
    />
  );
};
