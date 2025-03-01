/**
 * Canvas录制GIF核心功能模块
 * @remarks 提供从Konva舞台录制GIF动画的核心功能
 */
import GIF from "gif.js";
import Konva from "konva";
import { GifRecordingController, RecordGifOptions } from "./types";

/**
 * 将Konva舞台内容录制为GIF
 * @remarks 使用gif.js库捕获Konva舞台内容并生成GIF动画
 * @param stage - 要录制的Konva舞台元素
 * @param options - GIF录制选项
 * @returns 一个包含控制方法的对象，用于停止录制并获取结果
 * @example
 * ```tsx
 * const stage = stageRef.current;
 * const controller = recordCanvasToGif(stage, { fps: 10 });
 *
 * // 稍后停止录制并获取结果
 * controller.stop().then(blob => {
 *   // 处理生成的GIF
 * });
 * ```
 */
export const recordCanvasToGif = (
  stage: Konva.Stage,
  options: RecordGifOptions = {}
): GifRecordingController => {
  // 获取舞台宽高
  const stageWidth = stage.width();
  const stageHeight = stage.height();
  
  const {
    fps = 10,
    quality = 10,
    width = stageWidth,
    height = stageHeight,
    showProgress = true,
    onProgress,
  } = options;

  // 每帧之间的时间间隔(毫秒)
  const frameDelay = 1000 / fps;

  let framesProcessed = 0;
  let stopped = false;
  let isRendering = false;
  let resolvePromise: (blob: Blob) => void;
  let rejectPromise: (error: Error) => void;
  let animationFrameId: number | null = null;
  let pendingFrames = 0; // 跟踪等待处理的帧数

  // 创建结果Promise
  const resultPromise = new Promise<Blob>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  // 创建GIF编码器实例
  const gif = new GIF({
    workers: 2,
    quality,
    width,
    height,
    workerScript: new URL("gif.js/dist/gif.worker.js", import.meta.url).href,
  });

  // 监听GIF完成事件
  gif.on("finished", (blob: Blob) => {
    resolvePromise(blob);
  });

  // 监听进度事件
  if (showProgress || onProgress) {
    gif.on("progress", (progress: number) => {
      if (onProgress) onProgress(progress);
    });
  }

  // 上次捕获时间
  let lastCaptureTime = 0;

  // 帧捕获函数 - 使用requestAnimationFrame实现更平滑的帧捕获
  const captureFrame = (timestamp: number) => {
    if (stopped || isRendering) {
      return;
    }

    // 计算自上次捕获以来的时间
    if (!lastCaptureTime) lastCaptureTime = timestamp;
    const elapsed = timestamp - lastCaptureTime;

    // 如果经过了足够的时间，捕获一帧
    if (elapsed >= frameDelay) {
      // 强制更新所有图层以确保最新的视频帧被渲染
      stage.getLayers().forEach(layer => layer.batchDraw());
      
      // 为当前帧创建新的canvas
      const currentCanvas = stage.toCanvas({
        pixelRatio: 1, // 使用1:1的像素比以避免尺寸问题
      });

      // 创建当前canvas内容的副本
      const img = new Image();
      pendingFrames++;
      
      img.onload = () => {
        // 添加当前图像帧到GIF
        gif.addFrame(img, { copy: true, delay: frameDelay });
        framesProcessed++;
        pendingFrames--;
        console.log(`已捕获第${framesProcessed}帧`);
        
        // 如果已停止录制且没有更多待处理的帧，开始渲染
        if (stopped && pendingFrames === 0 && !isRendering) {
          isRendering = true;
          console.log(`GIF录制完成，共捕获${framesProcessed}帧`);
          gif.render();
        }
      };
      
      // 将当前canvas内容转换为数据URL并设置给图像
      img.src = currentCanvas.toDataURL('image/png');

      // 更新上次捕获时间
      lastCaptureTime = timestamp;
    }

    // 调度下一帧捕获
    animationFrameId = requestAnimationFrame(captureFrame);
  };

  // 开始捕获
  animationFrameId = requestAnimationFrame(captureFrame);

  return {
    // 停止录制并获取结果
    stop: () => {
      if (stopped || isRendering) {
        return resultPromise;
      }

      stopped = true;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // 如果没有捕获任何帧且没有待处理的帧，返回错误
      if (framesProcessed === 0 && pendingFrames === 0) {
        rejectPromise(new Error("未捕获任何帧"));
        return resultPromise;
      }

      // 如果还有待处理的帧，等待它们完成
      if (pendingFrames === 0) {
        isRendering = true;
        console.log(`GIF录制完成，共捕获${framesProcessed}帧`);
        gif.render();
      }
      
      return resultPromise;
    },

    // 中止录制
    abort: () => {
      stopped = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      rejectPromise(new Error("GIF录制已中止"));
    },
  };
};
