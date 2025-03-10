/**
 * 视频捕获组件实现
 * @remarks 负责在Konva画布中渲染和更新视频内容，支持拖拽和缩放
 */

import { useEffect, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import Konva from "konva";

export interface VideoCaptureProps {
  /** 视频元素 */
  videoElement: HTMLVideoElement | null;
  /** 画布宽度 */
  width: number;
  /** 画布高度 */
  height: number;
  /** 图像引用回调函数 */
  onImageRef: (node: Konva.Image) => void;
  /** 捕获结束回调函数 */
  onCaptureEnded?: () => void;
  /** 缩放比例 */
  scale?: number;
  /** X坐标位置 */
  x?: number;
  /** Y坐标位置 */
  y?: number;
  /** 拖拽结束回调函数 */
  onDragEnd?: (e: Konva.KonvaEventObject<MouseEvent>) => void;
}

/**
 * 视频捕获组件实现
 * @param videoElement - 视频DOM元素
 * @param width - 画布宽度
 * @param height - 画布高度
 * @param onImageRef - 图像引用回调函数
 * @param onCaptureEnded - 捕获结束回调函数
 * @param scale - 缩放比例，默认为1
 * @param x - X坐标位置，默认为0
 * @param y - Y坐标位置，默认为0
 * @param onDragEnd - 拖拽结束回调函数
 * @returns 可拖拽的视频图像组件
 */
export const VideoCaptureImpl = ({
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
  const imageRef = useRef<Konva.Image | null>(null);
  const animationRef = useRef<number | null>(null);

  // 处理视频帧更新和结束事件
  useEffect(() => {
    if (!videoElement) {
      // 如果没有视频元素，取消动画帧
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // 处理视频结束事件
    const handleVideoEnded = () => {
      if (onCaptureEnded) {
        onCaptureEnded();
      }
    };

    videoElement.addEventListener("ended", handleVideoEnded);

    // 更新视频帧的动画循环
    const updateVideoFrame = () => {
      if (imageRef.current) {
        const layer = imageRef.current.getLayer();
        if (layer) {
          layer.batchDraw();
        }
      }

      animationRef.current = requestAnimationFrame(updateVideoFrame);
    };

    updateVideoFrame();

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      videoElement.removeEventListener("ended", handleVideoEnded);
    };
  }, [videoElement, onCaptureEnded]);

  /**
   * 处理图像引用
   * @param node - Konva图像节点
   */
  const handleImageRef = (node: Konva.Image) => {
    imageRef.current = node;
    onImageRef(node);
  };

  // 如果没有视频元素则不渲染
  if (!videoElement) return null;

  // 获取视频尺寸，如果不可用则使用画布尺寸
  const videoWidth = videoElement.videoWidth || width;
  const videoHeight = videoElement.videoHeight || height;

  return (
    <KonvaImage
      ref={handleImageRef}
      image={videoElement}
      x={x}
      y={y}
      width={videoWidth * scale}
      height={videoHeight * scale}
      draggable={true}
      onDragEnd={onDragEnd}
    />
  );
};
