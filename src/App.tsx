import { useState } from "react";
import Toolbar, { ToolbarItemProps } from "@/components/Toolbar";
import Canvas from "@/components/Canvas";
import { Video, Camera, LayoutGrid } from "lucide-react";

/**
 * 应用主组件
 * @remarks 包含工具栏和画布两个主要部分
 * @returns 应用主界面
 */
function App() {
  // 功能状态
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // 处理抓取视频流
  const handleCaptureVideo = () => {
    // 如果正在录制，不允许切换捕获状态
    if (isRecording) {
      console.warn("请先停止录制再切换视频流状态");
      return;
    }
    
    setIsCapturing(!isCapturing);
    // 这里添加抓取视频流的实际逻辑
    console.log("抓取视频流", !isCapturing ? "开始" : "停止");
  };

  // 处理开始录制
  const handleStartRecording = () => {
    // 只有在已经成功捕获视频流的情况下才能录制
    if (isCapturing) {
      setIsRecording(!isRecording);
      console.log("录制", !isRecording ? "开始" : "停止");
    } else {
      console.warn("请先抓取视频流再开始录制");
    }
  };

  // 处理选择画布尺寸
  const handleSelectCanvasSize = () => {
    // 这里添加选择画布尺寸的逻辑
    console.log("选择画布尺寸");
    // 可以显示一个尺寸选择对话框或下拉菜单
  };

  // 工具栏项目定义
  const toolbarItems: ToolbarItemProps[] = [
    {
      icon: <Video size={18} />,
      label: "抓取视频流",
      onClick: handleCaptureVideo,
      active: isCapturing,
      // 如果正在录制，禁用视频流切换
      disabled: isRecording,
    },
    {
      icon: <Camera size={18} />,
      label: "开始录制",
      onClick: handleStartRecording,
      active: isRecording,
      // 只有在抓取视频流时才能录制
      disabled: !isCapturing,
    },
    {
      icon: <LayoutGrid size={18} />,
      label: "画布尺寸",
      onClick: handleSelectCanvasSize,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* 上部分：工具栏 */}
      <div className="flex justify-center p-4">
        <Toolbar
          items={toolbarItems}
          className="rounded-full shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100"
        />
      </div>

      {/* 下部分：Canvas */}
      <div className="flex-1">
        <Canvas isCapturing={isCapturing} isRecording={isRecording} />
      </div>
    </div>
  );
}

export default App;
