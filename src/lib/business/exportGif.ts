/**
 * Canvas录制GIF功能模块
 * @remarks 提供将Canvas内容导出为GIF动画的功能
 */
import GIF from "gif.js";

/**
 * 录制GIF配置选项接口
 */
interface RecordGifOptions {
  /** 每秒帧数 */
  fps?: number;
  /** 质量, 1-30, 数值越小质量越高 */
  quality?: number;
  /** 录制持续时间(毫秒) - 仅在自动模式下使用 */
  duration?: number;
  /** 宽度，默认使用canvas宽度 */
  width?: number;
  /** 高度，默认使用canvas高度 */
  height?: number;
  /** 是否显示录制进度 */
  showProgress?: boolean;
  /** 进度回调函数 */
  onProgress?: (progress: number) => void;
}

/**
 * 将Canvas内容录制为GIF
 * @remarks 使用gif.js库捕获canvas内容并生成GIF动画
 * @param canvas - 要录制的Canvas元素
 * @param options - GIF录制选项
 * @returns 一个包含控制方法的对象，用于停止录制并获取结果
 * @example
 * ```tsx
 * const canvas = document.querySelector('canvas');
 * const controller = recordCanvasToGif(canvas, { fps: 10 });
 *
 * // 稍后停止录制并获取结果
 * controller.stop().then(blob => {
 *   // 处理生成的GIF
 * });
 * ```
 */
export const recordCanvasToGif = (
  canvas: HTMLCanvasElement,
  options: RecordGifOptions = {}
): {
  stop: () => Promise<Blob>;
  abort: () => void;
} => {
  const {
    fps = 10,
    quality = 10,
    width = canvas.width,
    height = canvas.height,
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
      // 添加当前canvas帧到GIF
      gif.addFrame(canvas, { copy: true, delay: frameDelay });
      framesProcessed++;
      console.log(`已捕获第${framesProcessed}帧`);

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
      isRendering = true;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      // 如果没有捕获任何帧，返回错误
      if (framesProcessed === 0) {
        rejectPromise(new Error("未捕获任何帧"));
        return resultPromise;
      }

      console.log(`GIF录制完成，共捕获${framesProcessed}帧`);

      // 开始渲染GIF
      gif.render();
      return resultPromise;
    },

    // 中止录制
    abort: () => {
      stopped = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      rejectPromise(new Error("GIF录制已中止"));
    },
  };
};

/**
 * 将GIF保存为文件
 * @remarks 提供文件下载功能
 * @param gifBlob - GIF的Blob数据
 * @param filename - 文件名，默认为'recorded.gif'
 */
export const saveGifToFile = (
  gifBlob: Blob,
  filename = "recorded.gif"
): void => {
  const url = URL.createObjectURL(gifBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  // 释放URL对象
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
