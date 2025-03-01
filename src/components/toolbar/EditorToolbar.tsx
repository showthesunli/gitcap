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
  const { isCapturing, setIsCapturing, isRecording, setIsRecording } =
    useEditorStore();

  const handlePresetSelect = (preset: keyof typeof CANVAS_PRESETS) => {
    onCanvasSizeChange(CANVAS_PRESETS[preset]);
  };

  const handleScreenCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const handleRecordGif = () => {
    setIsRecording(!isRecording);
  };

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
