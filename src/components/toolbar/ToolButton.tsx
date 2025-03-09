import { Button } from "@/components/ui/button";
import { ComponentType } from "react";

interface ToolButtonProps {
  icon: ComponentType<{ className?: string; size?: number }>;
  text: string;
  variant?: "outline" | "destructive" | "primary";
  onClick?: () => void;
  disabled?: boolean;
}

export function ToolButton({
  icon: Icon,
  text,
  variant = "outline",
  onClick,
  disabled,
}: ToolButtonProps) {
  // 根据变体类型应用不同的样式
  const getButtonClasses = () => {
    switch (variant) {
      case "primary":
        return "brand-gradient text-white shadow-md hover:shadow-lg transition-all";
      case "outline":
        return "bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all";
      case "destructive":
        return "bg-red-500 text-white";
      default:
        return "gap-2 group hover:bg-primary/10 hover:shadow-sm";
    }
  };

  return (
    <Button
      variant={variant === "primary" ? "default" : variant}
      size="default"
      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${getButtonClasses()}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className={`${variant === "primary" ? "text-white" : "text-primary dark:text-primary-foreground"} mr-2`} size={18} />
      <span className={variant === "primary" ? "text-white" : "text-black dark:text-white"}>
        {text}
      </span>
    </Button>
  );
}
