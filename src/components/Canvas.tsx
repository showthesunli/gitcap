import { FC, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { initializeCanvas } from "@/lib/business/canvas";
import { createWheelHandler, onCanvasZoom, onSystemEvent } from "@/lib/business/event-handlers";
import { handleScreenCaptureClick, exportToGIF } from "@/lib/business/screen-capture";

/**
 * Canvas组件属性定义
 * @remarks 定义Canvas组件接收的属性
 */
type CanvasProps = {
  isCapturing?: boolean;
  isRecording?: boolean;
};

/**
 * Canvas组件
 * @remarks 用于绘制和展示内容的画布区域
 * @returns Canvas渲染元素
 */
const Canvas: FC<CanvasProps> = ({ isCapturing = false, isRecording = false }) => {
  // 使用ref存储fabric canvas实例
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // 初始化fabric canvas
  useEffect(() => {
    // 确保只初始化一次
    if (!fabricCanvasRef.current) {
      // 初始化fabric canvas
      fabricCanvasRef.current = initializeCanvas();
      const canvas = fabricCanvasRef.current;
      
      // 绑定滚轮缩放事件
      canvas.on("mouse:wheel", createWheelHandler(canvas));

      // 监听画布缩放事件
      const unsubscribeZoom = onCanvasZoom((data) => {
        console.log(`画布缩放到级别: ${data.details?.zoomLevel}`);
      });

      // 监听系统事件
      const unsubscribeSystem = onSystemEvent((data) => {
        if (data.level === "error") {
          console.error(`错误 (${data.code}): ${data.message}`);
        }
      });

      // 组件卸载时清理资源
      return () => {
        unsubscribeZoom();
        unsubscribeSystem();
        fabricCanvasRef.current?.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, []);

  // 处理捕获状态变化
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && isCapturing) {
      handleScreenCaptureClick(canvas).catch(error => {
        console.error("视频捕获错误:", error);
      });
    }
  }, [isCapturing]);

  // 处理录制状态变化
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && isRecording) {
      exportToGIF(canvas);
    }
  }, [isRecording]);

  return (
    <div className="h-full w-full flex justify-center items-center p-6">
      <div className="relative">
        {/* 录制状态指示器 */}
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center bg-red-500/80 text-white px-3 py-1 rounded-full z-10">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            录制中
          </div>
        )}
        
        {/* 视频流状态指示器 */}
        {isCapturing && !isRecording && (
          <div className="absolute top-4 right-4 flex items-center bg-blue-500/80 text-white px-3 py-1 rounded-full z-10">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            视频流已连接
          </div>
        )}
        
        <canvas
          width="1080"
          height="720"
          className="relative z-0 rounded-xl border-2 border-slate-300/50 shadow-[0_10px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm"
          id="c"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Canvas;
