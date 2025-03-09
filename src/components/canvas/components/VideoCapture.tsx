/**
 * @file VideoCapture.tsx
 * @description 视频捕获的Konva图像组件，支持鼠标滚轮缩放
 */

import { Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { useRef, useEffect } from "react";
import { calculateVideoSize } from "@/lib/utils/videoUtils";
import { useVideoFrameUpdate } from "@/lib/hooks/useVideoFrameUpdate";
import { useWheelZoom } from "@/lib/hooks/useWheelZoom";

/**
 * 渲染视频捕获的Konva图像组件的属性
 */
interface VideoCaptureProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
  onImageRef: (node: Konva.Image) => void;
  // 新增: 当捕获结束时的回调函数
  onCaptureEnded?: () => void;
}

/**
 * 渲染视频捕获的Konva图像组件
 * @remarks 将视频元素渲染为Konva图像，支持拖拽和鼠标滚轮缩放
 */
export const VideoCapture = ({
  videoElement,
  width,
  height,
  onImageRef,
  onCaptureEnded,
}: VideoCaptureProps) => {
  // 使用ref保存图像实例
  const imageRef = useRef<Konva.Image | null>(null);

  // 使用自定义钩子处理视频帧更新
  useVideoFrameUpdate(imageRef);

  // 使用自定义钩子处理鼠标滚轮缩放
  const handleWheel = useWheelZoom({
    minScale: 0.1,
    maxScale: 10,
    scaleBy: 1.1,
  });

  // 处理ref的回调函数
  const handleRef = (node: Konva.Image) => {
    imageRef.current = node;
    onImageRef(node);
  };

  // 监听视频轨道的ended事件
  useEffect(() => {
    if (!videoElement || !videoElement.srcObject) return;
    
    const stream = videoElement.srcObject as MediaStream;
    const videoTracks = stream.getVideoTracks();
    
    if (videoTracks.length === 0) return;
    
    const videoTrack = videoTracks[0];
    
    // 添加轨道结束事件监听器
    const handleTrackEnded = () => {
      console.log("视频轨道已结束 - 从VideoCapture组件中处理");
      if (onCaptureEnded) {
        onCaptureEnded();
      }
    };
    
    videoTrack.addEventListener('ended', handleTrackEnded);
    
    // 清理函数
    return () => {
      videoTrack.removeEventListener('ended', handleTrackEnded);
    };
  }, [videoElement, onCaptureEnded]);

  // 在所有hooks都调用后再进行条件返回
  if (!videoElement) return null;

  // 计算视频实际尺寸和舞台尺寸的比例，保持视频原始比例
  const videoWidth = videoElement.videoWidth || width;
  const videoHeight = videoElement.videoHeight || height;

  // 使用工具函数计算尺寸
  const {
    width: scaledWidth,
    height: scaledHeight,
    x,
    y,
  } = calculateVideoSize(videoWidth, videoHeight, width, height);

  return (
    <KonvaImage
      image={videoElement}
      width={scaledWidth}
      height={scaledHeight}
      draggable={true}
      ref={handleRef}
      onWheel={handleWheel}
      x={x}
      y={y}
    />
  );
};
