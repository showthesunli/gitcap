import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentType } from "react";

interface ToolButtonProps {
  icon: ComponentType<{ className?: string }>;
  text: string;
}

export function ToolButton({ icon: Icon, text }: ToolButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 group hover:bg-primary/10 hover:shadow-sm"
    >
      <Icon className="w-4 h-4 text-primary" />
      <span className="hidden md:inline-block text-primary/80 group-hover:text-primary">
        {text}
      </span>
    </Button>
  );
}
