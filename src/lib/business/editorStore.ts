import { create } from "zustand";
import Konva from "konva";

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
  // 新增: 比例锁定相关状态
  aspectRatioLocked: boolean;
  toggleAspectRatioLock: () => void;
  // 新增: 调整特定维度时保持比例
  resizeWithAspectRatio: (size: { width?: number; height?: number }) => { width: number; height: number };
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvasSize: {
    width: 1080,
    height: 720,
  },
  setCanvasSize: (size) => set({ canvasSize: size }),
  isCapturing: false,
  setIsCapturing: (isCapturing) => set({ isCapturing }),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  stageRef: null,
  setStageRef: (stageRef) => set({ stageRef }),
  
  // 新增: 比例锁定状态
  aspectRatioLocked: false,
  
  // 新增: 切换比例锁定状态
  toggleAspectRatioLock: () => set((state) => ({ 
    aspectRatioLocked: !state.aspectRatioLocked 
  })),
  
  // 新增: 根据当前比例调整尺寸
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
  }
}));
