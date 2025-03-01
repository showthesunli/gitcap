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
 * @remarks 将视频元素渲染为Konva图像
 */
export const VideoCapture = ({ 
  videoElement, 
  width, 
  height, 
  onImageRef 
}: VideoCaptureProps) => {
  if (!videoElement) return null;
  
  return (
    <KonvaImage
      image={videoElement}
      width={width}
      height={height}
      ref={onImageRef}
    />
  );
};
