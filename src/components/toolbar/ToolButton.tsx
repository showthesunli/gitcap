import { Button } from "@/components/ui/button";
import { ComponentType } from "react";

interface ToolButtonProps {
  icon: ComponentType<{ className?: string }>;
  text: string;
  variant?: "outline" | "destructive";
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
  return (
    <Button
      variant={variant}
      size="sm"
      className="gap-2 group hover:bg-primary/10 hover:shadow-sm"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="w-4 h-4 text-primary" />
      <span className="hidden md:inline-block text-primary/80 group-hover:text-primary">
        {text}
      </span>
    </Button>
  );
}
