/**
 * @file CanvasSizeControl.tsx
 * @description 画布尺寸和比例控制组件
 */

import { useState, useEffect } from "react";
import { Ruler, LockIcon, UnlockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { ToolButton } from "./ToolButton";
import { useEditorStore } from "@/lib/business/editorStore";
import { CANVAS_PRESETS, CanvasPresetKey } from "@/lib/constants/canvasPresets";

/**
 * 画布尺寸控制组件
 * @remarks 提供画布尺寸调整、比例锁定和预设尺寸选择功能
 */
export const CanvasSizeControl = () => {
  const { 
    canvasSize, 
    setCanvasSize, 
    aspectRatioLocked, 
    toggleAspectRatioLock,
    resizeWithAspectRatio
  } = useEditorStore();
  
  // 本地输入状态管理
  const [inputValues, setInputValues] = useState({
    width: canvasSize.width.toString(),
    height: canvasSize.height.toString()
  });

  // 当store中的尺寸变化时更新输入框
  useEffect(() => {
    setInputValues({
      width: canvasSize.width.toString(),
      height: canvasSize.height.toString()
    });
  }, [canvasSize.width, canvasSize.height]);

  /**
   * 处理宽度输入变化
   */
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const widthValue = e.target.value;
    setInputValues(prev => ({ ...prev, width: widthValue }));
    
    // 尝试解析输入值
    const width = parseInt(widthValue);
    if (!isNaN(width) && width > 0) {
      // 应用新尺寸，根据需要保持比例
      const newSize = resizeWithAspectRatio({ width });
      // 更新输入框中的高度值，以反映比例调整的结果
      if (aspectRatioLocked) {
        setInputValues(prev => ({ ...prev, height: newSize.height.toString() }));
      }
      setCanvasSize(newSize);
    }
  };

  /**
   * 处理高度输入变化
   */
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const heightValue = e.target.value;
    setInputValues(prev => ({ ...prev, height: heightValue }));
    
    // 尝试解析输入值
    const height = parseInt(heightValue);
    if (!isNaN(height) && height > 0) {
      // 应用新尺寸，根据需要保持比例
      const newSize = resizeWithAspectRatio({ height });
      // 更新输入框中的宽度值，以反映比例调整的结果
      if (aspectRatioLocked) {
        setInputValues(prev => ({ ...prev, width: newSize.width.toString() }));
      }
      setCanvasSize(newSize);
    }
  };

  /**
   * 处理输入框失去焦点事件
   */
  const handleBlur = () => {
    // 重置为有效值
    setInputValues({
      width: canvasSize.width.toString(),
      height: canvasSize.height.toString()
    });
  };

  /**
   * 应用预设尺寸
   */
  const handlePresetSelect = (preset: CanvasPresetKey) => {
    setCanvasSize(CANVAS_PRESETS[preset]);
  };

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger>
        <ToolButton
          icon={Ruler}
          text={`画布尺寸 (${canvasSize.width}×${canvasSize.height})`}
        />
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-4 space-y-4"
        align="start"
        sideOffset={8}
      >
        {/* 自定义尺寸输入 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground/90">
              自定义尺寸
            </h4>
            <Button
              size="sm"
              variant={aspectRatioLocked ? "default" : "outline"}
              className="h-7 px-2 flex items-center gap-1"
              onClick={toggleAspectRatioLock}
            >
              {aspectRatioLocked ? (
                <>
                  <LockIcon className="h-3.5 w-3.5" />
                  <span className="text-xs">比例已锁定</span>
                </>
              ) : (
                <>
                  <UnlockIcon className="h-3.5 w-3.5" />
                  <span className="text-xs">锁定比例</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">宽度</label>
              <Input
                value={inputValues.width}
                onChange={handleWidthChange}
                onBlur={handleBlur}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">高度</label>
              <Input
                value={inputValues.height}
                onChange={handleHeightChange}
                onBlur={handleBlur}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* 预设尺寸选择 */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground/90">
            预设尺寸
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-auto py-1 px-2 text-xs justify-start"
              onClick={() => handlePresetSelect("default")}
            >
              <span className="text-left">
                默认<br/>
                <span className="text-muted-foreground">
                  {CANVAS_PRESETS.default.width}×{CANVAS_PRESETS.default.height}
                </span>
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-auto py-1 px-2 text-xs justify-start"
              onClick={() => handlePresetSelect("vertical")}
            >
              <span className="text-left">
                竖屏<br/>
                <span className="text-muted-foreground">
                  {CANVAS_PRESETS.vertical.width}×{CANVAS_PRESETS.vertical.height}
                </span>
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-auto py-1 px-2 text-xs justify-start"
              onClick={() => handlePresetSelect("square")}
            >
              <span className="text-left">
                正方形<br/>
                <span className="text-muted-foreground">
                  {CANVAS_PRESETS.square.width}×{CANVAS_PRESETS.square.height}
                </span>
              </span>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
