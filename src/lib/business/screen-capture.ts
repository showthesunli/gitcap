/**
 * 屏幕捕捉画布集成模块
 * @packageDocumentation
 * @module ScreenCapture
 * @remarks
 * 处理Fabric.js画布与屏幕捕捉功能的集成，包含：
 * - 视频对象创建
 * - 渲染循环控制
 * - UI事件处理
 * - 媒体流生命周期管理
 */

import * as fabric from "fabric";
import { createScreenCaptureVideo } from "./capture";
import GIF from 'gif.js';

/**
 * 创建视频图像对象
 * @param video - HTML视频元素实例 {@link HTMLVideoElement}
 * @returns 配置完成的Fabric图像对象 {@link fabric.FabricImage}
 * @remarks
 * 保持fabric原生API调用方式，禁用对象缓存以保证实时渲染性能
 * 
 * @example
 * ```typescript
 * const videoElement = document.createElement('video');
 * const fabricImage = createVideoImageObject(videoElement);
 * ```
 */
export const createVideoImageObject = (
  video: HTMLVideoElement
): fabric.FabricImage => {
  return new fabric.FabricImage(video, {
    width: video.videoWidth,
    height: video.videoHeight,
    objectCaching: false,
  });
};

/**
 * 启动画布渲染循环
 * @param canvas - 需要启动渲染循环的Fabric画布实例 {@link fabric.Canvas}
 * @remarks
 * 使用Fabric内置的动画帧请求机制实现高效渲染
 * 保持每秒60帧的渲染性能优化
 * 
 * @example
 * ```typescript
 * const canvas = new fabric.Canvas('c');
 * startRenderLoop(canvas);
 * ```
 */
export const startRenderLoop = (canvas: fabric.Canvas): void => {
  const renderFrame = () => {
    canvas.renderAll();
    fabric.util.requestAnimFrame(renderFrame);
  };
  fabric.util.requestAnimFrame(renderFrame);
};

/**
 * 导出画布内容为GIF
 * @param canvas - 目标Fabric画布实例 {@link fabric.Canvas}
 * @param duration - GIF持续时间（毫秒）
 * @param fps - 帧率
 * @remarks
 * 使用gif.js库将画布内容导出为GIF动画
 */
export const exportToGIF = (canvas: fabric.Canvas, duration: number = 3000, fps: number = 10): void => {
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    workerScript: new URL('gif.js/dist/gif.