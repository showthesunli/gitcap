import { create } from "zustand";
import Konva from "konva";
import { toast } from "sonner";

/**
 * 编辑器状态管理
 * @remarks 使用Zustand管理编辑器的全局状态
 * @returns 编辑器状态和操作方法
 * @example
 * ```ts
 * const { canvasSize, setCanvasSize } = useEditorStore();
 * ```
 */
type EditorStore = {
  canvasSize: {
    width: number;
    height: number;
  };
  setCanvasSize: (size: { width: number; height: number }) => void;
  isCapturing: boolean;
  setIsCapturing: (isCapturing: boolean) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  // 添加 stageRef
  stageRef: Konva.Stage | null;
  setStageRef: (ref: Konva.Stage | null) => void;
  // 捕获的视频image引用
  captureImageRef: Konva.Image | null;
  setCaptureImageRef: (ref: Konva.Image | null) => void;
  // 新增: 比例锁定相关状态
  aspectRatioLocked: boolean;
  toggleAspectRatioLock: () => void;
  // 新增: 调整特定维度时保持比例
  resizeWithAspectRatio: (size: { width?: number; height?: number }) => { width: number; height: number };
  // 新增: 处理捕获意外中断
  handleCaptureStopped: () => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvasSize: {
    width: 500,
    height: 300,
  },
  setCanvasSize: (size) => {
    const { isCapturing, isRecording } = get();
    
    // 互斥检查：捕获或录制中不能调整尺寸
    if (isCapturing || isRecording) {
      toast.error("在捕获或录制过程中不能调整画布尺寸");
      return;
    }
    
    set({ canvasSize: size });
  },
  
  isCapturing: false,
  setIsCapturing: (isCapturing) => {
    const { isRecording } = get();
    
    // 如果要停止捕获，但正在录制中，不允许
    if (!isCapturing && get().isCapturing && isRecording) {
      toast.error("录制过程中不能停止屏幕捕获");
      return;
    }
    
    // 设置捕获状态
    set({ isCapturing });
    
    // 如果停止捕获，同时清除捕获图像引用
    if (!isCapturing) {
      set({ captureImageRef: null });
    }
  },
  
  isRecording: false,
  setIsRecording: (isRecording) => {
    const { isCapturing } = get();
    
    // 如果要开始录制，但没有在捕获中，不允许
    if (isRecording && !isCapturing) {
      toast.error("请先开始屏幕捕获");
      return;
    }
    
    set({ isRecording });
  },
  
  stageRef: null,
  setStageRef: (stageRef) => set({ stageRef }),
  
  captureImageRef: null,
  setCaptureImageRef: (ref) => set({ captureImageRef: ref }),
  
  // 比例锁定状态
  aspectRatioLocked: false,
  
  // 切换比例锁定状态
  toggleAspectRatioLock: () => set((state) => ({ 
    aspectRatioLocked: !state.aspectRatioLocked 
  })),
  
  // 根据当前比例调整尺寸
  resizeWithAspectRatio: (newSize) => {
    const { canvasSize, aspectRatioLocked } = get();
    const { width: oldWidth, height: oldHeight } = canvasSize;
    
    // 如果比例未锁定或同时提供了宽高，直接返回
    if (!aspectRatioLocked || (newSize.width !== undefined && newSize.height !== undefined)) {
      return { 
        width: newSize.width !== undefined ? newSize.width : oldWidth,
        height: newSize.height !== undefined ? newSize.height : oldHeight
      };
    }
    
    // 当前宽高比
    const aspectRatio = oldWidth / oldHeight;
    
    // 根据提供的维度计算另一个维度
    if (newSize.width !== undefined) {
      // 根据新宽度计算高度
      const height = Math.round(newSize.width / aspectRatio);
      return { width: newSize.width, height };
    } else if (newSize.height !== undefined) {
      // 根据新高度计算宽度
      const width = Math.round(newSize.height * aspectRatio);
      return { width, height: newSize.height };
    }
    
    // 如果没有提供任何维度，返回当前尺寸
    return canvasSize;
  },
  
  // 处理捕获意外中断（如用户撤销授权）
  handleCaptureStopped: () => {
    const { isRecording, captureImageRef } = get();
    
    // 如果正在录制GIF
    if (isRecording) {
      toast.warning("屏幕捕获已中断，正在处理已录制的GIF");
      // 设置录制状态为false，触发保存已录制的GIF部分
      set({ isRecording: false });
    } 
    // 如果只是在捕获
    else {
      toast.info("屏幕捕获已中断");
    }
    
    // 移除画布中的图像
    if (captureImageRef) {
      captureImageRef.remove();
    }
    
    // 重置状态
    set({ 
      isCapturing: false,
      captureImageRef: null
    });
  }
}));
