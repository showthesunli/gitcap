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
  const frameDelayMs = 1000 / fps;

  let framesProcessed = 0;
  let stopped = false;
  let isRendering = false;
  let resolvePromise: (blob: Blob) => void;
  let rejectPromise: (error: Error) => void;
  let captureInterval: ReturnType<typeof setInterval> | null = null;

  // 添加时间追踪变量
  const startTime = Date.now();
  let lastCaptureTime = startTime;
  let totalRealDuration = 0;

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

  // 使用setInterval代替requestAnimationFrame，确保在浏览器后台时也能捕获帧
  captureInterval = setInterval(() => {
    if (stopped || isRendering) {
      return;
    }

    // 计算实际经过的时间（毫秒）
    const currentTime = Date.now();
    const realFrameDelay = currentTime - lastCaptureTime;
    lastCaptureTime = currentTime;

    // 累计实际录制时长
    totalRealDuration += realFrameDelay;

    // 计算实际帧延迟（厘秒）
    const realFrameDelayCs = Math.round(realFrameDelay / 10);

    // 强制更新所有图层以确保最新的视频帧被渲染
    stage.getLayers().forEach((layer) => layer.batchDraw());

    // 为当前帧创建新的canvas
    const currentCanvas = stage.toCanvas({
      pixelRatio: 1, // 使用1:1的像素比以避免尺寸问题
    });

    // 使用实际测量的帧延迟，而不是理论值
    gif.addFrame(currentCanvas, {
      copy: true,
      delay: realFrameDelayCs > 1 ? realFrameDelayCs : 10, // 确保最小延迟为10厘秒
    });

    framesProcessed++;
    console.log(
      `已捕获第${framesProcessed}帧，实际延迟: ${realFrameDelayCs / 100}秒`
    );
  }, frameDelayMs);

  return {
    // 停止录制并获取结果
    stop: () => {
      if (stopped || isRendering) {
        return resultPromise;
      }

      stopped = true;

      if (captureInterval !== null) {
        clearInterval(captureInterval);
        captureInterval = null;
      }

      // 如果没有捕获任何帧，返回错误
      if (framesProcessed === 0) {
        rejectPromise(new Error("未捕获任何帧"));
        return resultPromise;
      }

      // 计算平均帧延迟
      const avgFrameDelayMs = totalRealDuration / framesProcessed;
      const avgFrameDelayCs = Math.round(avgFrameDelayMs / 10);

      isRendering = true;
      console.log(
        `GIF录制完成，共捕获${framesProcessed}帧，总时长: ${
          totalRealDuration / 1000
        }秒，平均帧延迟: ${avgFrameDelayCs / 100}秒`
      );
      gif.render();

      return resultPromise;
    },

    // 中止录制
    abort: () => {
      stopped = true;
      if (captureInterval !== null) {
        clearInterval(captureInterval);
        captureInterval = null;
      }
      rejectPromise(new Error("GIF录制已中止"));
    },
  };
};
