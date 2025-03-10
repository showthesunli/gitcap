import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

interface VideoCaptureProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
  onImageRef: (node: Konva.Image) => void;
  onCaptureEnded?: () => void;
  scale?: number;
  x?: number;
  y?: number;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}

/**
 * 视频捕获组件
 * @remarks 将视频流渲染到Konva画布上
 * @param videoElement - HTML视频元素
 * @param width - 画布宽度
 * @param height - 画布高度
 * @param onImageRef - 图像引用回调
 * @param onCaptureEnded - 捕获结束回调
 * @param scale - 缩放比例
 * @param x - X坐标位置
 * @param y - Y坐标位置
 * @param onDragEnd - 拖动结束回调
 * @returns Konva图像组件
 */
export const VideoCapture = ({
  videoElement,
  width,
  height,
  onImageRef,
  onCaptureEnded,
  scale = 1,
  x = 0,
  y = 0,
  onDragEnd,
}: VideoCaptureProps) => {
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVideoFrame = () => {
      animationRef.current = requestAnimationFrame(updateVideoFrame);
    };

    updateVideoFrame();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!videoElement) {
    return null;
  }

  return (
    <KonvaImage
      ref={onImageRef}
      image={videoElement}
      x={x}
      y={y}
      width={width}
      height={height}
      scaleX={scale}
      scaleY={scale}
      draggable={true}
      onDragEnd={onDragEnd}
    />
  );
};
