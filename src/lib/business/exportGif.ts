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
  /** 录制持续时间(毫秒) */
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
 * @returns 包含GIF数据的Promise<Blob>
 * @example
 * ```tsx
 * const canvas = document.querySelector('canvas');
 * const gifBlob = await recordCanvasToGif(canvas, { fps: 10, duration: 3000 });
 * const url = URL.createObjectURL(gifBlob);
 * // 下载或显示GIF
 * ```
 */
export const recordCanvasToGif = (
  canvas: HTMLCanvasElement,
  options: RecordGifOptions = {}
): Promise<Blob> => {
  const {
    fps = 10,
    quality = 10,
    duration = 3000,
    width = canvas.width,
    height = canvas.height,
    showProgress = true,
    onProgress,
  } = options;

  // 计算需要的帧数
  const frameCount = Math.ceil((duration / 1000) * fps);
  // 每帧之间的时间间隔(毫秒)
  const frameDelay = 1000 / fps;

  return new Promise((resolve, reject) => {
    // 创建GIF编码器实例
    const gif = new GIF({
      workers: 2,
      quality,
      width,
      height,
      workerScript: new URL("gif.js/dist/gif.worker.js", import.meta.url).href, // 使用Vite的导入语法
    });

    let framesProcessed = 0;
    let stopped = false;

    // 监听GIF完成事件
    gif.on("finished", (blob: Blob) => {
      resolve(blob);
    });

    // 监听进度事件
    if (showProgress || onProgress) {
      gif.on("progress", (progress: number) => {
        if (onProgress) onProgress(progress);
      });
    }

    // 帧捕获函数
    const captureFrame = () => {
      if (stopped || framesProcessed >= frameCount) {
        // 完成所有帧的捕获，渲染GIF
        gif.render();
        return;
      }

      // 添加当前canvas帧到GIF
      gif.addFrame(canvas, { copy: true, delay: frameDelay });
      framesProcessed++;

      // 调度下一帧捕获
      setTimeout(captureFrame, frameDelay);
    };

    // 开始捕获
    captureFrame();

    // 提供一种方法来停止录制
    gif.abort = () => {
      stopped = true;
      reject(new Error("GIF录制已中止"));
    };
  });
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
