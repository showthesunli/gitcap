/**
 * 视频捕获组件
 * @remarks 负责动态加载视频捕获实现，使用React.lazy和Suspense以减小初始包大小
 */

import React, { Suspense } from "react";
import { Rect } from "react-konva"; // 导入 Konva 的 Rect 组件

// 使用类型导入避免加载实际的模块
import type { VideoCaptureProps } from "./VideoCaptureImpl";

// 创建一个符合Konva要求的加载提示组件
const VideoCaptureLoading = () => {
  // 使用 Konva 支持的 Rect 组件代替 div
  return <Rect width={0} height={0} opacity={0} />;
};

// 动态导入实际的实现组件
const VideoCaptureImpl = React.lazy(() => import("./VideoCaptureImpl").then(module => ({
  default: module.VideoCaptureImpl
})));

/**
 * 视频捕获组件 - 包装器
 * @remarks 使用React.lazy动态加载实际的视频捕获实现
 */
export const VideoCapture = (props: VideoCaptureProps) => {
  return (
    <Suspense fallback={<VideoCaptureLoading />}>
      <VideoCaptureImpl {...props} />
    </Suspense>
  );
};

// 重新导出接口以确保类型一致性
export type { VideoCaptureProps } from "./VideoCaptureImpl";
