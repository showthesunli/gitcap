import { Video, Camera, Ruler } from "lucide-react";
import { ToolButton } from "./ToolButton";

// 预设画布尺寸配置
const CANVAS_PRESETS = {
  default: { width: 1080, height: 720 },
  vertical: { width: 720, height: 1080 },
  square: { width: 720, height: 720 }
};

export function EditorToolbar() {
  return (
    <div className="flex justify-center p-3 bg-background border-b shadow-sm">
      <nav className="flex gap-3">
        <ToolButton icon={Video} text="视频导入" />
        <ToolButton icon={Camera} text="屏幕捕捉" />
        <ToolButton 
          icon={Ruler} 
          text={`画布尺寸 (${CANVAS_PRESETS.default.width}×${CANVAS_PRESETS.default.height})`} 
        />
      </nav>
    </div>
  );
}
