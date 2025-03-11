/**
 * 基于Web Worker的GIF录制实现
 * @remarks 提供在Web Worker中运行的GIF录制功能，解决浏览器后台时帧捕获问题
 * 
 * 注意：这个模块是实验性的，仅在浏览器支持OffscreenCanvas时可用。
 * 未被直接使用，预留为未来优化方案。
 */

// 此文件是未来改进的基础，包含Web Worker版本的GIF录制逻辑

/**
 * Worker信息类型定义
 */
type WorkerMessage = {
  type: string;
  [key: string]: any;
};

/**
 * Worker代码内容
 * 这里使用一个函数转字符串的方式，用于生成Worker blob
 */
const workerFunction = () => {
  // Worker内部逻辑
  let gif: any = null;
  let canvas: OffscreenCanvas | null = null;
  let ctx: OffscreenCanvasRenderingContext2D | null = null;
  let captureInterval: number | null = null;
  let framesProcessed = 0;
  let stopped = false;
  
  // 接收主线程消息
  self.onmessage = function(e: MessageEvent<WorkerMessage>) {
    const { type } = e.data;
    
    switch (type) {
      case "init":
        // 初始化Worker
        canvas = e.data.canvas;
        ctx = canvas.getContext("2d");
        
        // 加载GIF.js库
        importScripts(e.data.gifJsUrl);
        
        // 初始化GIF编码器
        // @ts-ignore (GIF在importScripts后可用)
        gif = new GIF({
          workers: 2,
          quality: e.data.options.quality || 10,
          width: e.data.options.width,
          height: e.data.options.height,
          workerScript: e.data.gifWorkerUrl,
        });
        
        gif.on("finished", (blob: Blob) => {
          self.postMessage({ type: "finished", blob });
        });
        
        if (e.data.options.showProgress) {
          gif.on("progress", (progress: number) => {
            self.postMessage({ type: "progress", progress });
          });
        }
        
        self.postMessage({ type: "initialized" });
        break;
        
      case "start":
        framesProcessed = 0;
        stopped = false;
        
        const frameDelay = 1000 / (e.data.options.fps || 10);
        
        // 使用setInterval捕获帧
        captureInterval = setInterval(() => {
          if (stopped || !canvas) return;
          
          gif.addFrame(canvas, { copy: true, delay: frameDelay });
          framesProcessed++;
          self.postMessage({ type: "frameCapture", count: framesProcessed });
        }, frameDelay);
        break;
        
      case "stop":
        stopped = true;
        
        if (captureInterval) {
          clearInterval(captureInterval);
          captureInterval = null;
        }
        
        if (framesProcessed === 0) {
          self.postMessage({ type: "error", message: "未捕获任何帧" });
          return;
        }
        
        self.postMessage({ type: "renderStart", frames: framesProcessed });
        gif.render();
        break;
        
      case "abort":
        stopped = true;
        
        if (captureInterval) {
          clearInterval(captureInterval);
          captureInterval = null;
        }
        
        self.postMessage({ type: "aborted" });
        break;
        
      case "updateFrame":
        // 更新canvas内容
        if (e.data.imageData && ctx) {
          ctx.putImageData(e.data.imageData, 0, 0);
        }
        break;
    }
  };
};

/**
 * 创建Worker Blob URL
 */
const createWorkerBlobUrl = () => {
  const blob = new Blob(
    [`(${workerFunction.toString()})()`], 
    { type: "application/javascript" }
  );
  return URL.createObjectURL(blob);
};

/**
 * 检查浏览器是否支持OffscreenCanvas
 */
const supportsOffscreenCanvas = () => {
  return typeof OffscreenCanvas !== "undefined";
};

/**
 * 创建基于Worker的GIF录制控制器
 * 注意：此方法是实验性的，目前未被直接使用
 */
export const createWorkerGifRecorder = (
  canvas: HTMLCanvasElement,
  options: {
    width: number;
    height: number;
    fps?: number;
    quality?: number;
    showProgress?: boolean;
    onProgress?: (progress: number) => void;
  }
): Promise<GifRecordingController> => {
  return new Promise((resolve, reject) => {
    if (!supportsOffscreenCanvas()) {
      reject(new Error("浏览器不支持OffscreenCanvas"));
      return;
    }
    
    try {
      // 转移canvas控制权到Worker
      const offscreen = canvas.transferControlToOffscreen();
      
      // 创建Worker
      const workerBlobUrl = createWorkerBlobUrl();
      const worker = new Worker(workerBlobUrl);
      
      let resolveRecordingPromise: (blob: Blob) => void;
      let rejectRecordingPromise: (error: Error) => void;
      
      worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const { type } = e.data;
        
        switch (type) {
          case "initialized":
            // Worker初始化完成，返回控制器
            resolve({
              stop: () => {
                return new Promise<Blob>((resolve, reject) => {
                  resolveRecordingPromise = resolve;
                  rejectRecordingPromise = reject;
                  
                  worker.postMessage({ type: "stop" });
                });
              },
              abort: () => {
                worker.postMessage({ type: "abort" });
                worker.terminate();
                URL.revokeObjectURL(workerBlobUrl);
                
                if (rejectRecordingPromise) {
                  rejectRecordingPromise(new Error("GIF录制已中止"));
                }
              }
            });
            break;
            
          case "progress":
            if (options.onProgress) {
              options.onProgress(e.data.progress);
            }
            break;
            
          case "finished":
            if (resolveRecordingPromise) {
              resolveRecordingPromise(e.data.blob);
            }
            
            // 清理资源
            worker.terminate();
            URL.revokeObjectURL(workerBlobUrl);
            break;
            
          case "error":
            if (rejectRecordingPromise) {
              rejectRecordingPromise(new Error(e.data.message));
            }
            
            // 清理资源
            worker.terminate();
            URL.revokeObjectURL(workerBlobUrl);
            break;
            
          case "aborted":
            if (rejectRecordingPromise) {
              rejectRecordingPromise(new Error("GIF录制已中止"));
            }
            break;
        }
      };
      
      // 初始化Worker
      worker.postMessage(
        {
          type: "init",
          canvas: offscreen,
          options: {
            width: options.width,
            height: options.height,
            fps: options.fps || 10,
            quality: options.quality || 10,
            showProgress: options.showProgress || false
          },
          gifJsUrl: "https://unpkg.com/gif.js/dist/gif.js",
          gifWorkerUrl: "https://unpkg.com/gif.js/dist/gif.worker.js"
        },
        [offscreen]
      );
      
      // 开始录制
      worker.postMessage({
        type: "start",
        options: {
          fps: options.fps || 10
        }
      });
      
    } catch (error) {
      reject(error);
    }
  });
};
