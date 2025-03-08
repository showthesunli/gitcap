/**
 * @file CanvasContainer.tsx
 * @description 画布容器组件，集成屏幕捕获功能
 */

import { useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { cn } from "@/lib/utils";
import { useScreenCapture } from "./hooks/useScreenCapture";
import { useKonvaImageUpdater } from "./hooks/useKonvaImageUpdater";
import { VideoCapture } from "./components/VideoCapture";
import { useEditorStore } from "@/lib/business/editorStore";
import Konva from "konva";

/**
 * 画布容器组件属性
 */
interface CanvasContainerProps {
  width: number;
  height: number;
}

/**
 * 画布容器组件
 * @remarks 集成屏幕捕获功能的Konva舞台
 */
export function CanvasContainer({ width, height }: CanvasContainerProps) {
  const { videoElement } = useScreenCapture();
  const { handleImageRef } = useKonvaImageUpdater(videoElement);
  const { setStageRef } = useEditorStore();
  const stageRef = useRef<Konva.Stage>(null);

  // 当 stageRef 可用时，更新到 store
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
    
    return () => {
      setStageRef(null);
    };
  }, [setStageRef]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* 创建一个带阴影和边框的画布容器 */}
      <div 
        className="bg-card rounded-lg shadow-lg border border-border/50 p-4 overflow-auto"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
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
          ref={stageRef}
        >
          <Layer>
            <VideoCapture 
              videoElement={videoElement} 
              width={width} 
              height={height} 
              onImageRef={handleImageRef} 
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { VideoCapture } from "./VideoCapture";
import { useEditorStore } from "@/lib/business/editorStore";
import { Monitor } from "lucide-react";

interface CanvasContainerProps {
  width: number;
  height: number;
}

/**
 * 画布容器组件
 * @remarks 包含Konva Stage和视频捕获层
 * @param width - 画布宽度
 * @param height - 画布高度
 * @returns 画布容器组件
 */
export const CanvasContainer = ({ width, height }: CanvasContainerProps) => {
  const { isCapturing } = useEditorStore();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const stageRef = useRef<any>(null);
  const imageRef = useRef<any>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  
  // 处理视频元素设置
  useEffect(() => {
    if (isCapturing && !videoElement) {
      const video = document.createElement("video");
      video.style.display = "none";
      document.body.appendChild(video);
      setVideoElement(video);

      return () => {
        video.remove();
        setVideoElement(null);
      };
    }
  }, [isCapturing, videoElement]);

  // 处理图像引用
  const handleImageRef = (node: any) => {
    imageRef.current = node;
  };

  // 渲染预览容器
  return (
    <div className="relative w-full max-w-3xl aspect-video mx-auto">
      {isCapturing && videoElement ? (
        <div className="w-full h-full rounded-xl border-2 border-solid border-gray-300 bg-white/50 backdrop-blur-sm shadow-md overflow-hidden">
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            style={{ 
              width: '100%', 
              height: '100%', 
              overflow: 'hidden' 
            }}
          >
            <Layer>
              <VideoCapture
                videoElement={videoElement}
                width={width}
                height={height}
                onImageRef={handleImageRef}
              />
            </Layer>
          </Stage>
        </div>
      ) : (
        <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm">
          <div className="text-center p-6">
            <Monitor className="mx-auto mb-4 text-black/80" size={48} />
            <p className="text-black mb-2">尚未捕捉屏幕</p>
            <p className="text-black/60 text-sm">点击右侧"捕捉屏幕"按钮开始</p>
          </div>
        </div>
      )}
      
      {/* 调整大小的控制点 */}
      <div 
        ref={resizeHandleRef}
        className="absolute bottom-0 right-0 w-5 h-5 bg-white border border-gray-300 rounded-full cursor-se-resize transform translate-x-1/2 translate-y-1/2 shadow-md"
      />
    </div>
  );
};
