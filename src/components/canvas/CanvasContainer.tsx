import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/business/editorStore";
import { startScreenCapture } from "@/lib/business/capture";
import Konva from "konva";

interface CanvasContainerProps {
  width: number;
  height: number;
}

export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { isCapturing, setIsCapturing } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureStopRef = useRef<(() => void) | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // 处理屏幕捕获
  useEffect(() => {
    let isMounted = true;

    const handleCapture = async () => {
      if (isCapturing) {
        try {
          // 清理之前的捕获
          if (captureStopRef.current) {
            captureStopRef.current();
          }

          // 开始新的捕获
          const { video, stop } = await startScreenCapture({
            video: { 
              muted: true,
              controls: false
            }
          });

          if (isMounted) {
            videoRef.current = video;
            captureStopRef.current = stop;
            setVideoElement(video);
            
            // 设置视频样式，使其不可见但仍然活跃
            video.style.position = 'absolute';
            video.style.opacity = '0';
            video.style.pointerEvents = 'none';
            document.body.appendChild(video);
          } else {
            // 如果组件已卸载，清理资源
            stop();
          }
        } catch (error) {
          console.error("屏幕捕获失败:", error);
          if (isMounted) {
            setIsCapturing(false);
          }
        }
      } else {
        // 停止捕获
        if (captureStopRef.current) {
          captureStopRef.current();
          captureStopRef.current = null;
        }
        
        if (videoRef.current) {
          videoRef.current.remove();
          videoRef.current = null;
        }
        
        setVideoElement(null);
      }
    };

    handleCapture();

    return () => {
      isMounted = false;
      
      // 清理资源
      if (captureStopRef.current) {
        captureStopRef.current();
      }
      
      if (videoRef.current) {
        videoRef.current.remove();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCapturing, setIsCapturing]);

  // 更新Konva图像
  const updateImage = (node: Konva.Image) => {
    if (!node || !videoElement) return;
    
    // 强制更新图层
    node.getLayer()?.batchDraw();
    
    // 继续动画循环
    animationFrameRef.current = requestAnimationFrame(() => updateImage(node));
  };

  // 当Konva图像挂载时开始更新循环
  const handleImageLoad = (node: Konva.Image) => {
    if (node && videoElement) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => updateImage(node));
    }
  };

  return (
    <div className="flex-1 bg-card flex items-center justify-center">
      <Stage
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className={cn(
          "border-2 border-dashed border-muted rounded-lg",
          "transition-[border-color] duration-300 hover:border-primary/50"
        )}
      >
        <Layer>
          {videoElement && (
            <KonvaImage
              image={videoElement}
              width={width}
              height={height}
              ref={handleImageLoad}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
