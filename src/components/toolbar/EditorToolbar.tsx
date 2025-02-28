import { Video, Camera, LayoutGrid } from "lucide-react";
import { ToolButton } from "./ToolButton";

export function EditorToolbar() {
  return (
    <div className="flex justify-center p-3 bg-background border-b shadow-sm">
      <nav className="flex gap-3">
        <ToolButton icon={Video} text="视频导入" />
        <ToolButton icon={Camera} text="屏幕捕捉" />
        <ToolButton icon={LayoutGrid} text="元素库" />
      </nav>
    </div>
  );
}
