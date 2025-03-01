import { create } from "zustand";

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
};
