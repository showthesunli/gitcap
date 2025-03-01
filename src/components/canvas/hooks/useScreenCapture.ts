/**
 * @file useScreenCapture.ts
 * @description 屏幕捕获功能的自定义Hook
 */

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/lib/business/editorStore";
import { startScreenCapture } from "@/lib/business/capture";

/**
 * 处理屏幕捕获的自定义Hook
 * @remarks 管理视频捕获的生命周期和状态
 * @returns 捕获的视频元素和捕获状态
 */
export const useScreenCapture = () => {
  const { isCapturing, setIsCapturing } = useEditorStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureStopRef = useRef<(() => void) | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

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
    };
  }, [isCapturing, setIsCapturing]);

  return { videoElement };
};
