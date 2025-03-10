/**
 * 工具栏动作钩子
 * @remarks 封装工具栏各个按钮的操作逻辑，分离UI和业务逻辑
 */
import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { useEditorStore } from "@/lib/business/editorStore";
import { recordCanvasToGif, saveGifToFile } from "@/lib/business/exportGif";
import { CANVAS_PRESETS, CanvasPresetKey } from "@/lib/constants/canvasPresets";

/**
 * GIF录制控制器接口
 * @remarks 定义了GIF录制过程中需要的控制方法
 */
interface GifRecordingController {
  /** 停止录制并获取GIF Blob数据 */
  stop: () => Promise<Blob>;
  /** 中止录制过程 */
  abort: () => void;
}

/**
 * 工具栏动作选项接口
 * @remarks 定义工具栏操作的配置选项
 */
interface ToolbarActionOptions {
  /** 每秒帧数，影响GIF录制质量和文件大小 */
  fps?: number;
}

/**
 * 工具栏动作钩子函数
 * @remarks 提供工具栏所需的各种交互动作和状态
 * @param onCanvasSizeChange - 画布尺寸变化回调函数
 * @param options - 工具栏配置选项
 * @returns 返回工具栏状态和动作函数集合
 */
export const useToolbarActions = (
  onCanvasSizeChange: (size: { width: number; height: number }) => void,
  options: ToolbarActionOptions = {}
) => {
  /** 设置默认fps值为10 */
  const { fps = 10 } = options;
  
  /** 从编辑器状态获取必要的状态和方法 */
  const { 
    isCapturing, 
    setIsCapturing, 
    isRecording, 
    setIsRecording,
    stageRef 
  } = useEditorStore();
  
  /** 存储当前GIF录制控制器的引用 */
  const gifRecordingRef = useRef<GifRecordingController | null>(null);

  /**
   * 处理预设尺寸选择
   * @param preset - 预设尺寸键名
   */
  const handlePresetSelect = (preset: CanvasPresetKey) => {
    onCanvasSizeChange(CANVAS_PRESETS[preset]);
  };

  /**
   * 处理屏幕捕获切换
   * @remarks 切换屏幕捕获的开启/关闭状态
   */
  const handleScreenCapture = () => {
    setIsCapturing(!isCapturing);
  };

  /**
   * 处理GIF录制
   * @remarks 开始或停止GIF录制过程
   */
  const handleRecordGif = async () => {
    // 如果未处于屏幕捕获状态，不能录制
    if (!isCapturing) {
      toast.error("无法录制", {
        description: "请先启动屏幕捕获功能"
      });
      return;
    }
    
    /** 检查画布引用是否存在 */
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
        /** 使用当前设置的fps参数进行录制 */
        gifRecordingRef.current = recordCanvasToGif(stageRef, {
          fps,  // 使用传入的fps值
          quality: 10, // 质量设置，1-30，越小质量越高
          showProgress: true, // 显示进度
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
      
      /** 检查录制控制器是否存在 */
      if (!gifRecordingRef.current) {
        return;
      }
      
      toast("处理中", {
        description: "正在生成GIF，请稍候..."
      });
      
      try {
        /** 停止录制并等待GIF生成完成 */
        const gifBlob = await gifRecordingRef.current.stop();
        
        /** 保存GIF文件到本地，使用时间戳命名 */
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
        /** 清理录制控制器引用 */
        gifRecordingRef.current = null;
      }
    }
  };

  /** 
   * 组件卸载时清理录制
   * @remarks 确保在组件卸载时中止任何正在进行的录制过程
   */
  useEffect(() => {
    return () => {
      if (gifRecordingRef.current) {
        gifRecordingRef.current.abort();
      }
    };
  }, []);

  /** 返回工具栏所需的状态和方法 */
  return {
    isCapturing,
    isRecording,
    handlePresetSelect,
    handleScreenCapture,
    handleRecordGif
  };
};
