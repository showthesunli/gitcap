/**
 * 编辑器工具栏组件
 * @remarks 提供画布操作的主要工具按钮，包括屏幕捕捉、GIF录制和画布尺寸调整
 */
import { Camera, CodeIcon } from "lucide-react";
import { ToolButton } from "./ToolButton";
import { CanvasSizeControl } from "./CanvasSizeControl";
import { useToolbarActions } from "@/lib/hooks/useToolbarActions";

interface EditorToolbarProps {
  currentSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

export const EditorToolbar = ({ onCanvasSizeChange }: EditorToolbarProps) => {
  const { isCapturing, isRecording, handleScreenCapture, handleRecordGif } =
    useToolbarActions(onCanvasSizeChange);

  return (
    <div className="flex justify-center p-3 bg-background border-b shadow-sm">
      <nav className="flex gap-3">
        {/* <ToolButton icon={Video} text="视频导入" /> */}
        <ToolButton
          icon={Camera}
          text={isCapturing ? "停止捕捉" : "屏幕捕捉"}
          variant={isCapturing ? "destructive" : "outline"}
          onClick={handleScreenCapture}
        />
        <ToolButton
          icon={CodeIcon}
          text={isRecording ? "停止录制" : "录制GIF"}
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleRecordGif}
          disabled={!isCapturing} // 只有在捕获状态才能录制
        />
        {/* 使用新的尺寸控制组件替代SizePresetsCard */}
        <CanvasSizeControl />
      </nav>
    </div>
  );
};
