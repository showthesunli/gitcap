import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

interface VideoCaptureProps {
  videoElement: HTMLVideoElement | null;
  width: number;
  height: number;
  onImageRef: (node: Konva.Image) => void;
  // 新增: 当捕获结束时的回调函数
  onCaptureEnded?: () => void;
}

/**
 * 视频捕获组件
 * @remarks 将视频流渲染到Konva画布上
 * @param videoElement - HTML视频元素
 * @param width - 画布宽度
 * @param height - 画布高度
 * @param onImageRef - 图像引用回调
 * @returns Konva图像组件
 */
export const VideoCapture = ({
  videoElement,
  width,
  height,
  onImageRef,
  onCaptureEnded,
}: VideoCaptureProps) => {
  const imageRef = useRef<Konva.Image | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // 如果没有视频元素，则不启动动画循环
    if (!videoElement) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // 监听视频结束事件
    const handleVideoEnded = () => {
      if (onCaptureEnded) {
        onCaptureEnded();
      }
    };

    videoElement.addEventListener('ended', handleVideoEnded);

    const updateVideoFrame = () => {
      // 如果图像引用存在，强制更新图层
      if (imageRef.current) {
        // 获取图像所在的图层并更新
        const layer = imageRef.current.getLayer();
        if (layer) {
          layer.batchDraw();
        }
      }
      
      // 继续请求下一帧
      animationRef.current = requestAnimationFrame(updateVideoFrame);
    };

    // 启动动画循环
    updateVideoFrame();

    return () => {
      // 清理
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      videoElement.removeEventListener('ended', handleVideoEnded);
    };
  }, [videoElement, onCaptureEnded]);

  // 保存图像引用
  const handleImageRef = (node: Konva.Image) => {
    imageRef.current = node;
    onImageRef(node);
  };

  // 如果没有视频元素，不渲染任何内容
  if (!videoElement) return null;

  return (
    <KonvaImage
      ref={handleImageRef}
      image={videoElement}
      x={0}
      y={0}
      width={width}
      height={height}
    />
  );
};
