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
};

export const useEditorStore = create<EditorStore>((set) => ({
  canvasSize: {
    width: 1080,
    height: 720,
  },
  setCanvasSize: (size) => set({ canvasSize: size }),
  isCapturing: false,
  setIsCapturing: (isCapturing) => set({ isCapturing }),
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  // 初始化 stageRef
  stageRef: null,
  setStageRef: (stageRef) => set({ stageRef }),
}));
