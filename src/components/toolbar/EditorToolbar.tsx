/**
 * 编辑器工具栏组件
 * @remarks 提供画布操作的主要工具按钮，包括屏幕捕捉、GIF录制和画布尺寸调整
 * 使用React.lazy动态加载实际实现以减小初始包大小
 */
import React, { Suspense } from "react";

// 使用类型导入避免加载实际的模块
import type { EditorToolbarProps } from "./EditorToolbarImpl";

// 创建一个加载提示组件
const ToolbarLoading = () => {
  return <div className="p-4">加载工具栏...</div>;
};

// 动态导入实际的实现组件
const EditorToolbarImpl = React.lazy(() => import("./EditorToolbarImpl").then(module => ({
  default: module.EditorToolbarImpl
})));

/**
 * 编辑器工具栏组件 - 包装器
 * @remarks 使用React.lazy动态加载实际的工具栏实现
 */
export const EditorToolbar = (props: EditorToolbarProps) => {
  return (
    <Suspense fallback={<ToolbarLoading />}>
      <EditorToolbarImpl {...props} />
    </Suspense>
  );
};

// 重新导出接口以确保类型一致性
export type { EditorToolbarProps } from "./EditorToolbarImpl";
