/**
 * Canvas录制GIF核心功能模块
 * @remarks 提供从Konva舞台录制GIF动画的核心功能，支持画中画模式保持后台录制
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
    usePictureInPicture = true, // 新增参数，默认启用PiP
  } = options;

  // 每帧之间的时间间隔(毫秒)
  const frameDelayMs = 1000 / fps;

  // 创建用于PiP的视频元素
  let pipVideo: HTMLVideoElement | null = null;
  let pipCanvas: HTMLCanvasElement | null = null;
  let pipStream: MediaStream | null = null;

  let framesProcessed = 0;
  let stopped = false;
  let isRendering = false;
  let resolvePromise: (blob: Blob) => void;
  let rejectPromise: (error: Error) => void;
  let animationFrameId: number | null = null;

  // 添加时间追踪变量
  const startTime = Date.now();
  let lastCaptureTime = startTime;
  let totalRealDuration = 0;
  let nextFrameTime = startTime;

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

  // 初始化PiP模式
  const initPictureInPicture = async () => {
    if (!usePictureInPicture || !document.pictureInPictureEnabled) {
      return false;
    }

    try {
      // 创建画布和视频元素
      pipCanvas = document.createElement('canvas');
      pipCanvas.width = 320; // 小尺寸足够保持PiP窗口小巧
      pipCanvas.height = 240;
      
      // 绘制舞台内容到画布，确保PiP有内容显示
      const ctx = pipCanvas.getContext('2d');
      if (ctx) {
        const miniStage = stage.clone();
        miniStage.width(pipCanvas.width);
        miniStage.height(pipCanvas.height);
        miniStage.scale({ x: pipCanvas.width / stageWidth, y: pipCanvas.height / stageHeight });
        miniStage.draw();
        const dataUrl = miniStage.toDataURL();
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = dataUrl;
      }

      // 从画布创建媒体流
      pipStream = pipCanvas.captureStream(fps);
      
      // 创建播放这个流的视频元素
      pipVideo = document.createElement('video');
      pipVideo.srcObject = pipStream;
      pipVideo.muted = true; // 静音
      pipVideo.style.position = 'fixed';
      pipVideo.style.opacity = '0.01'; // 几乎不可见
      pipVideo.style.pointerEvents = 'none';
      pipVideo.style.width = '1px';
      pipVideo.style.height = '1px';
      pipVideo.style.zIndex = '-1';

      // 添加到DOM并开始播放
      document.body.appendChild(pipVideo);
      await pipVideo.play();
      
      // 进入画中画模式
      await pipVideo.requestPictureInPicture();
      
      console.log("已启用画中画模式，录制将在后台继续进行");
      return true;
    } catch (error) {
      console.error("启用画中画模式失败:", error);
      cleanupPictureInPicture();
      return false;
    }
  };

  // 清理PiP资源
  const cleanupPictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement === pipVideo) {
        await document.exitPictureInPicture();
      }
      
      if (pipStream) {
        pipStream.getTracks().forEach(track => track.stop());
        pipStream = null;
      }
      
      if (pipVideo) {
        pipVideo.remove();
        pipVideo = null;
      }
      
      pipCanvas = null;
    } catch (error) {
      console.error("清理画中画资源时出错:", error);
    }
  };

  // 使用requestAnimationFrame的帧捕获函数
  const captureFrame = (timestamp: number) => {
    if (stopped || isRendering) {
      return;
    }

    const currentTime = Date.now();
    
    // 检查是否已经到了捕获下一帧的时间
    if (currentTime >= nextFrameTime) {
      // 计算实际经过的时间（毫秒）
      const realFrameDelay = currentTime - lastCaptureTime;
      lastCaptureTime = currentTime;
      
      // 设置下一帧的时间
      nextFrameTime = currentTime + frameDelayMs;

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
      
      // 如果启用了PiP，更新PiP画布内容
      if (pipCanvas && pipCanvas.getContext('2d')) {
        const ctx = pipCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, pipCanvas.width, pipCanvas.height);
          ctx.drawImage(
            currentCanvas, 
            0, 0, currentCanvas.width, currentCanvas.height,
            0, 0, pipCanvas.width, pipCanvas.height
          );
        }
      }
    }

    // 请求下一帧
    animationFrameId = requestAnimationFrame(captureFrame);
  };

  // 启动录制流程
  const startRecording = async () => {
    // 先尝试初始化PiP模式
    if (usePictureInPicture) {
      await initPictureInPicture();
    }
    
    // 然后开始帧捕获
    animationFrameId = requestAnimationFrame(captureFrame);
  };

  // 立即开始录制
  startRecording();

  return {
    // 停止录制并获取结果
    stop: async () => {
      if (stopped || isRendering) {
        return resultPromise;
      }

      stopped = true;

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // 清理PiP模式资源
      await cleanupPictureInPicture();

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
    abort: async () => {
      stopped = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      // 清理PiP资源
      await cleanupPictureInPicture();
      
      rejectPromise(new Error("GIF录制已中止"));
    },
  };
};
