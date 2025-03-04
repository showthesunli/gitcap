/**
 * FPS控制组件
 * @remarks 提供GIF录制帧率的调整功能
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Gauge } from "lucide-react";

interface FpsControlProps {
  fps: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const FpsControl = ({ fps, onChange, disabled = false }: FpsControlProps) => {
  const [inputValue, setInputValue] = useState(fps.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 1 && value <= 60) {
      onChange(value);
    } else {
      // 如果无效则重置为当前fps
      setInputValue(fps.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  // 预设FPS值
  const presets = [10, 15, 24, 30];

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span className="text-xs">FPS</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>设置GIF帧率 (FPS)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="w-14 h-8 text-center"
        min={1}
        max={60}
      />
      
      <div className="flex gap-1">
        {presets.map(preset => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            className="h-6 px-1.5 text-xs"
            onClick={() => {
              onChange(preset);
              setInputValue(preset.toString());
            }}
            disabled={disabled || fps === preset}
          >
            {preset}
          </Button>
        ))}
      </div>
    </div>
  );
};
