import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 工具栏项目属性定义
 * @remarks 定义每个工具按钮的属性
 */
type ToolbarItemProps = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

/**
 * 工具栏组件属性
 * @remarks 工具栏的主要配置项
 */
type ToolbarProps = {
  items: ToolbarItemProps[];
  className?: string;
};

/**
 * 工具栏项目组件
 * @remarks 单个工具按钮的实现
 */
const ToolbarItem = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
}: ToolbarItemProps) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1",
        active && "bg-primary text-primary-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

/**
 * 工具栏组件
 * @remarks 画布顶部的工具栏，包含各种绘图工具
 */
const Toolbar = ({ items, className }: ToolbarProps) => {
  return (
    <div
      className={cn(
        "bg-gray-100 border-b border-gray-200 p-2 flex items-center",
        className
      )}
    >
      <div className="flex space-x-2">
        {items.map((item, index) => (
          <ToolbarItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
export type { ToolbarProps, ToolbarItemProps };
