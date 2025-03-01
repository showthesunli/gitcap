import {
  Video,
  Camera,
  Ruler,
  MonitorSmartphone,
  Square,
  CodeIcon,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEditorStore } from "@/lib/business/editorStore";
import { useRef, useEffect } from "react";
import { recordCanvasToGif, saveGifToFile } from "@/lib/business/exportGif";
// 替换为 sonner 的 toast
import { toast } from "sonner";

const CANVAS_PRESETS = {
  default: { width: 1080, height: 720 },
  vertical: { width: 720, height: 1080 },
  square: { width: 720, height: 720 },
};

interface EditorToolbarProps {
  currentSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
}

export function EditorToolbar({
  currentSize,
  onCanvasSizeChange,
}: EditorToolbarProps) {
  const { 
    isCapturing, 
    setIsCapturing, 
    isRecording, 
    setIsRecording,
    stageRef 
  } = useEditorStore();
  
  const gifRecordingRef = useRef<any>(null);

  const handlePresetSelect = (preset: keyof typeof CANVAS_PRESETS) => {
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

    // 获取 Konva Stage 的 canvas 元素
    const canvas = stageRef.toCanvas();

    if (!isRecording) {
      // 开始录制
      setIsRecording(true);
      toast("GIF录制中", {
        description: "正在录制画布内容，点击停止按钮结束录制"
      });

      try {
        // 开始录制GIF，获取控制器
        gifRecordingRef.current = recordCanvasToGif(canvas, {
          fps: 10,
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

  return (
    <div className="flex justify-center p-3 bg-background border-b shadow-sm">
      <nav className="flex gap-3">
        <ToolButton icon={Video} text="视频导入" />
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
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>
            <ToolButton
              icon={Ruler}
              text={`画布尺寸 (${currentSize.width}×${currentSize.height})`}
            />
          </HoverCardTrigger>
          <HoverCardContent
            className="w-64 p-2 space-y-2"
            align="start"
            sideOffset={8}
          >
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-foreground/90">
                预设尺寸
              </h4>
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent"
                  onClick={() => handlePresetSelect("default")}
                >
                  <Ruler className="w-4 h-4 text-primary" />
                  <span>
                    默认 ({CANVAS_PRESETS.default.width}×
                    {CANVAS_PRESETS.default.height})
                  </span>
                </button>
                <button
                  className="flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent"
                  onClick={() => handlePresetSelect("vertical")}
                >
                  <MonitorSmartphone className="w-4 h-4 text-primary" />
                  <span>
                    竖屏 ({CANVAS_PRESETS.vertical.width}×
                    {CANVAS_PRESETS.vertical.height})
                  </span>
                </button>
                <button
                  className="flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent"
                  onClick={() => handlePresetSelect("square")}
                >
                  <Square className="w-4 h-4 text-primary" />
                  <span>
                    正方形 ({CANVAS_PRESETS.square.width}×
                    {CANVAS_PRESETS.square.height})
                  </span>
                </button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </nav>
    </div>
  );
}
