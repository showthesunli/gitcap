import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 工具栏项目属性定义
 * @remarks 定义每个工具按钮的属性
 * @param icon - 工具按钮的图标
 * @param label - 工具按钮的文本标签
 * @param onClick - 点击按钮时触发的回调函数
 * @param active - 按钮是否处于激活状态
 * @param disabled - 按钮是否禁用
 */
export type ToolbarItemProps = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

/**
 * 工具栏组件属性
 * @remarks 工具栏的主要配置项
 * @param items - 工具栏项目数组
 * @param className - 额外的CSS类名
 */
type ToolbarProps = {
  items: ToolbarItemProps[];
  className?: string;
};

/**
 * 工具栏项目组件
 * @remarks 单个工具按钮的实现
 * @param props - 工具栏项目属性
 * @returns 渲染的工具栏项目组件
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
        "flex items-center justify-center p-2",
        active && "bg-primary text-primary-foreground"
      )}
      title={label}
    >
      {icon}
    </Button>
  );
};

/**
 * 工具栏组件
 * @remarks 画布顶部的工具栏，包含各种绘图工具
 * @param props - 工具栏组件属性
 * @returns 渲染的工具栏组件
 */
const Toolbar = ({ items, className }: ToolbarProps) => {
  return (
    <div
      className={cn(
        "p-1 flex items-center",
        className
      )}
    >
      <div className="flex space-x-1">
        {items.map((item, index) => (
          <ToolbarItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
export type { ToolbarProps };
