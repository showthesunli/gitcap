/**
 * @module 画布核心模块
 * @remarks
 * 1. 扩展Fabric.js原生Canvas类型声明
 * 2. 提供画布初始化工厂函数
 * 3. 管理画布基础配置和状态扩展
 * 
 * @example
 * ```ts
 * // 初始化并挂载画布
 * const canvas = initializeCanvas();
 * document.body.appendChild(canvas.getElement());
 * ```
 */
import { Canvas } from "fabric";

// 扩展 fabric 类型声明，为 Canvas 添加拖拽状态跟踪属性
declare module "fabric" {
  interface Canvas {
    isDragging?: boolean;    // 标记画布是否处于拖拽状态
    lastPosX?: number;       // 记录上次鼠标X坐标
    lastPosY?: number;       // 记录上次鼠标Y坐标
  }
}

/**
 * 画布初始化工厂函数
 * 返回配置好的 fabric.Canvas 实例
 * 集中管理画布创建逻辑，便于后续扩展配置项
 */
export const initializeCanvas = (): Canvas => {
  const canvas = new Canvas("c");  // 'c' 对应 HTML canvas 元素的 ID
  
  // 获取 canvas 元素
  const canvasElement = document.getElementById("c") as HTMLCanvasElement;
  
  // 获取计算后的 CSS 尺寸
  const computedStyle = window.getComputedStyle(canvasElement);
  const cssWidth = parseInt(computedStyle.width, 10);
  const cssHeight = parseInt(computedStyle.height, 10);
  
  // 设置 canvas 的 HTML 属性以匹配 CSS 尺寸
  canvasElement.width = cssWidth;
  canvasElement.height = cssHeight;
  
  // 通知 Fabric.js 尺寸已更改
  canvas.setDimensions({ width: cssWidth, height: cssHeight });
  
  return canvas;
};
