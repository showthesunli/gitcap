/**
 * 画布尺寸预设卡片组件
 * @remarks 显示预设画布尺寸选项，允许用户快速切换画布尺寸
 */
import { Ruler, MonitorSmartphone, Square } from "lucide-react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { ToolButton } from "./ToolButton";
import { CANVAS_PRESETS, CanvasPresetKey } from "@/lib/constants/canvasPresets";

interface SizePresetsCardProps {
  currentSize: { width: number; height: number };
  onPresetSelect: (preset: CanvasPresetKey) => void;
}

export const SizePresetsCard = ({
  currentSize,
  onPresetSelect
}: SizePresetsCardProps) => {
  return (
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
              onClick={() => onPresetSelect("default")}
            >
              <Ruler className="w-4 h-4 text-primary" />
              <span>
                默认 ({CANVAS_PRESETS.default.width}×
                {CANVAS_PRESETS.default.height})
              </span>
            </button>
            <button
              className="flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent"
              onClick={() => onPresetSelect("vertical")}
            >
              <MonitorSmartphone className="w-4 h-4 text-primary" />
              <span>
                竖屏 ({CANVAS_PRESETS.vertical.width}×
                {CANVAS_PRESETS.vertical.height})
              </span>
            </button>
            <button
              className="flex items-center gap-3 p-2 text-sm rounded-md hover:bg-accent"
              onClick={() => onPresetSelect("square")}
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
  );
};
