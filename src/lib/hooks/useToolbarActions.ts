/**
 * 工具栏动作钩子
 * @remarks 封装工具栏各个按钮的操作逻辑，分离UI和业务逻辑
 */
import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/lib/business/editorStore";
import { recordCanvasToGif, saveGifToFile } from "@/lib/business/exportGif";
import { CANVAS_PRESETS, CanvasPresetKey } from "@/lib/constants/canvasPresets";

interface ToolbarActionOptions {
  fps?: number;
}

export const useToolbarActions = (
  onCanvasSizeChange: (size: { width: number; height: number }) => void,
  options: ToolbarActionOptions = {}
) => {
  const { fps = 10 } = options;
  
  const { 
    isCapturing, 
    setIsCapturing, 
    isRecording, 
    setIsRecording,
    stageRef 
  } = useEditorStore();
  
  const gifRecordingRef = useRef<any>(null);

  const handlePresetSelect = (preset: CanvasPresetKey) => {
    onCanvasSizeChange(CANVAS_PRESETS[preset]);
  };

  const handleScreenCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const handleRecordGif = async () => {
    // 如果未处于屏幕捕获状态，不能录制
    if (!isCapturing) {
      toast.error("无法录制", {
        description: "请先启动屏幕捕获功能"
      });
      return;
    }
    
    if (!stageRef) {
      toast.error("录制失败", {
        description: "无法获取画布元素"
      });
      return;
    }

    if (!isRecording) {
      // 开始录制
      setIsRecording(true);
      toast("GIF录制中", {
        description: "正在录制画布内容，点击停止按钮结束录制"
      });

      try {
        // 使用当前设置的fps进行录制
        gifRecordingRef.current = recordCanvasToGif(stageRef, {
          fps,  // 使用传入的fps值
          quality: 10,
          showProgress: true,
          onProgress: (progress) => {
            console.log(`处理进度: ${Math.round(progress * 100)}%`);
          },
        });
      } catch (error) {
        console.error("GIF录制启动失败:", error);
        setIsRecording(false);
        toast.error("录制失败", {
          description: "启动GIF录制时出错"
        });
      }
    } else {
      // 停止录制
      setIsRecording(false);
      
      if (!gifRecordingRef.current) {
        return;
      }
      
      toast("处理中", {
        description: "正在生成GIF，请稍候..."
      });
      
      try {
        // 停止录制并等待GIF生成完成
        const gifBlob = await gifRecordingRef.current.stop();
        
        // 保存GIF文件
        saveGifToFile(gifBlob, `canvas-recording-${new Date().getTime()}.gif`);
        
        toast.success("录制完成", {
          description: "GIF已保存到您的下载文件夹"
        });
      } catch (error) {
        console.error("GIF录制失败:", error);
        toast.error("录制失败", {
          description: "生成GIF时出错"
        });
      } finally {
        gifRecordingRef.current = null;
      }
    }
  };

  // 组件卸载时清理录制
  useEffect(() => {
    return () => {
      if (gifRecordingRef.current) {
        gifRecordingRef.current.abort();
      }
    };
  }, []);

  return {
    isCapturing,
    isRecording,
    handlePresetSelect,
    handleScreenCapture,
    handleRecordGif
  };
};
