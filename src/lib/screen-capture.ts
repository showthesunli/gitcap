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
    workerScript: new URL('gif.js/dist/gif.worker.js', import.meta.url).href
  });

  const frameInterval = 1000 / fps;
  const startTime = Date.now();
  
  const captureFrame = () => {
    if (Date.now() - startTime < duration) {
      // 创建临时图像元素
      const img = new Image();
      // 使用 toDataURL 获取完整的画布内容
      img.src = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      img.onload = () => {
        // 将图像添加到 GIF
        gif.addFrame(img, { delay: frameInterval, copy: true });
        
        // 安排下一帧捕获
        setTimeout(captureFrame, frameInterval);
      };
    } else {
      // 完成捕获，渲染 GIF
      gif.render();
    }
  };

  gif.on('finished', (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.gif';
    a.click();
    URL.revokeObjectURL(url);
  });

  // 开始捕获第一帧
  captureFrame();
};

/**
 * 处理屏幕捕捉按钮点击事件
 * @param canvas - 目标Fabric画布实例 {@link fabric.Canvas}
 * @throws {@link DOMException} 当用户拒绝屏幕捕捉权限时抛出
 * @throws {@link Error} 媒体流初始化失败时抛出
 * @remarks
 * 实现完整的媒体流生命周期管理：
 * 1. 初始化屏幕捕捉
 * 2. 创建Fabric图像对象
 * 3. 注册媒体流终止监听
 * 4. 启动渲染循环
 * 
 * @example
 * ```typescript
 * document.getElementById('captureBtn').addEventListener('click', () => {
 *   handleScreenCaptureClick(canvasInstance);
 * });
 * ```
 */
export const handleScreenCaptureClick = async (canvas: fabric.Canvas) => {
  try {
    const video = await createScreenCaptureVideo({
      controls: false,
      muted: true,
    });
    const videoImage = createVideoImageObject(video);

    const videoTrack = (video.srcObject as MediaStream)?.getVideoTracks()[0];
    videoTrack?.addEventListener("ended", () => {
      canvas.remove(videoImage);
      canvas.requestRenderAll();
      video.srcObject = null;
    });

    canvas.add(videoImage);
    startRenderLoop(canvas);
  } catch (error) {
    handleCaptureError(error);
  }
};

/**
 * 统一错误处理函数
 * @param error - 捕获的错误对象
 * @internal
 * @remarks
 * 错误处理策略：
 * - 控制台输出详细错误日志
 * - 用户界面显示友好错误提示
 * - 保留原始错误堆栈信息
 */
const handleCaptureError = (error: unknown): void => {
  console.error("屏幕捕捉失败:", error);
  alert(`操作失败: ${error instanceof Error ? error.message : "未知错误"}`);
};
