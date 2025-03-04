/**
 * 编辑器工具栏组件
 * @remarks 提供画布操作的主要工具按钮，包括屏幕捕捉、GIF录制和画布尺寸调整
 */
import { useState } from "react";
import { Camera, CodeIcon } from "lucide-react";
import { ToolButton } from "./ToolButton";
import { CanvasSizeControl } from "./CanvasSizeControl";
import { FpsControl } from "./FpsControl";
import { useToolbarActions } from "@/lib/hooks/useToolbarActions";

interface EditorToolbarProps {
  currentSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

export const EditorToolbar = ({ onCanvasSizeChange }: EditorToolbarProps) => {
  const [fps, setFps] = useState(10); // 默认 FPS 值为 10
  
  const { isCapturing, isRecording, handleScreenCapture, handleRecordGif } =
    useToolbarActions(onCanvasSizeChange, { fps });

  return (
    <div className="flex justify-center p-3 bg-background border-b shadow-sm">
      <nav className="flex gap-3 items-center">
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
        
        {/* FPS 控制 */}
        <div className="border-l pl-3 ml-1">
          <FpsControl 
            fps={fps}
            onChange={setFps}
            disabled={isRecording} // 录制时禁用 FPS 调整
          />
        </div>
        
        {/* 画布尺寸控制 */}
        <div className="border-l pl-3 ml-1">
          <CanvasSizeControl />
        </div>
      </nav>
    </div>
  );
};
