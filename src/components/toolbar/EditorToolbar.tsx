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
import { toast } from "@/components/ui/use-toast";

const CANVAS_PRESETS = {
  default: { width: 1080, height: 720 },
  vertical: { width: 720, height: 1080 },
  square: { width: 720, height: 720 },
};

interface EditorToolbarProps {
  currentSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function EditorToolbar({
  currentSize,
  onCanvasSizeChange,
  canvasRef,
}: EditorToolbarProps) {
  const { isCapturing, setIsCapturing, isRecording, setIsRecording } =
    useEditorStore();
  const gifRecordingRef = useRef<any>(null);

  const handlePresetSelect = (preset: keyof typeof CANVAS_PRESETS) => {
    onCanvasSizeChange(CANVAS_PRESETS[preset]);
  };

  const handleScreenCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const handleRecordGif = async () => {
    // 如果没有canvas引用，显示错误提示
    if (!canvasRef?.current) {
      toast({
        title: "录制失败",
        description: "无法获取画布元素",
        variant: "destructive",
      });
      return;
    }

    if (!isRecording) {
      // 开始录制
      setIsRecording(true);
      toast({
        title: "GIF录制中",
        description: "正在录制画布内容，请等待...",
      });

      try {
        // 开始录制GIF
        gifRecordingRef.current = recordCanvasToGif(canvasRef.current, {
          fps: 10,
          duration: 3000, // 默认录制3秒
          showProgress: true,
          onProgress: (progress) => {
            console.log(`录制进度: ${Math.round(progress * 100)}%`);
          },
        });
      } catch (error) {
        console.error("GIF录制启动失败:", error);
        setIsRecording(false);
        toast({
          title: "录制失败",
          description: "启动GIF录制时出错",
          variant: "destructive",
        });
      }
    } else {
      // 停止录制
      setIsRecording(false);
      
      try {
        // 等待GIF生成完成
        const gifBlob = await gifRecordingRef.current;
        
        // 保存GIF文件
        saveGifToFile(gifBlob, `canvas-recording-${new Date().getTime()}.gif`);
        
        toast({
          title: "录制完成",
          description: "GIF已保存到您的下载文件夹",
        });
      } catch (error) {
        console.error("GIF录制失败:", error);
        toast({
          title: "录制失败",
          description: "生成GIF时出错",
          variant: "destructive",
        });
      } finally {
        gifRecordingRef.current = null;
      }
    }
  };

  // 组件卸载时清理录制
  useEffect(() => {
    return () => {
      if (gifRecordingRef.current && typeof gifRecordingRef.current.abort === 'function') {
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
