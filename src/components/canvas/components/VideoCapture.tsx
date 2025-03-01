/**
 * @file VideoCapture.tsx
 * @description 视频捕获的Konva图像组件，支持鼠标滚轮缩放
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
 * @remarks 将视频元素渲染为Konva图像，支持拖拽和鼠标滚轮缩放
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

  // 处理鼠标滚轮事件
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    // 阻止默认行为（页面滚动）
    e.evt.preventDefault();
    
    const image = imageRef.current;
    if (!image) return;

    const stage = image.getStage();
    if (!stage) return;
    
    // 缩放系数 - 每次缩放的比例
    const scaleBy = 1.1;
    
    // 获取当前缩放值
    const oldScale = image.scaleX();

    // 获取鼠标相对于舞台的位置
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // 计算鼠标相对于图像的位置
    const mousePointTo = {
      x: (pointer.x - image.x()) / oldScale,
      y: (pointer.y - image.y()) / oldScale,
    };

    // 确定缩放方向：向上滚动为放大，向下滚动为缩小
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // 限制缩放范围，防止过度缩放或缩小
    const limitedScale = Math.max(0.1, Math.min(newScale, 10));

    // 应用新的缩放比例
    image.scale({ x: limitedScale, y: limitedScale });

    // 调整位置，使缩放以鼠标位置为中心
    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };
    
    image.position(newPos);
    
    // 重绘图层
    image.getLayer()?.batchDraw();
  };

  return (
    <KonvaImage
      image={videoElement}
      width={scaledWidth}
      height={scaledHeight}
      draggable={true}
      ref={handleRef}
      onWheel={handleWheel}
      // 居中显示
      x={(width - scaledWidth) / 2}
      y={(height - scaledHeight) / 2}
    />
  );
};
