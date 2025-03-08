/**
 * 编辑器工具栏组件
 * @remarks 提供画布操作的主要工具按钮，包括屏幕捕捉、GIF录制和画布尺寸调整
 */
import { useState } from "react";
import { Camera, Download, PlayCircle, Info } from "lucide-react";
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
    <div className="panel-gradient rounded-xl shadow-lg p-6 w-full lg:w-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black dark:text-white">录制控制</h2>
      </div>

      {/* 功能按钮区 */}
      <div className="space-y-4 mb-8">
        <ToolButton
          icon={Camera}
          text={isCapturing ? "停止捕捉" : "捕捉屏幕"}
          variant={isCapturing ? "destructive" : "primary"}
          onClick={handleScreenCapture}
        />
        
        <ToolButton
          icon={PlayCircle}
          text={isRecording ? "停止录制" : "开始录制"}
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleRecordGif}
          disabled={!isCapturing} // 只有在捕获状态才能录制
        />
        
        <ToolButton
          icon={Download}
          text="下载GIF"
          variant="outline"
          disabled={true} // 先默认禁用，直到有GIF可下载
        />
      </div>

      {/* 参数设置区 */}
      <div className="space-y-5">
        <h3 className="text-black dark:text-white font-medium">参数设置</h3>
        
        {/* 画布尺寸控制 */}
        <div>
          <label className="block text-black dark:text-white text-sm mb-2">Canvas尺寸</label>
          <CanvasSizeControl />
        </div>
        
        {/* FPS 控制 */}
        <div>
          <label className="block text-black dark:text-white text-sm mb-2">FPS帧率</label>
          <FpsControl 
            fps={fps}
            onChange={setFps}
            disabled={isRecording} // 录制时禁用 FPS 调整
          />
          <p className="text-black dark:text-white opacity-60 text-sm mt-1">较高帧率生成更流畅的GIF，但文件更大</p>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="text-black dark:text-white text-sm opacity-70 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          <span>录制完成后可直接下载或分享GIF</span>
        </div>
      </div>
    </div>
  );
};
