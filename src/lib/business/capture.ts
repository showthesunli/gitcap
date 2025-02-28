class ScreenCaptureError extends Error {
  public readonly type:
    | "unsupported"
    | "permission-denied"
    | "no-content"
    | "aborted"
    | "invalid-input"
    | "no-video-track"
    | "unknown";
  public readonly cause?: unknown;

  constructor(
    type: ScreenCaptureError["type"],
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = "ScreenCaptureError";
    this.type = type;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, ScreenCaptureError.prototype);
  }
}

export async function captureScreenStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new ScreenCaptureError("unsupported", "当前浏览器不支持屏幕共享功能");
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    stream.getVideoTracks()[0].onended = () => {
      console.log("用户已停止屏幕共享");
    };

    return stream;
  } catch (error) {
    let errorType: ScreenCaptureError["type"] = "unknown";
    let message = "屏幕捕获失败";

    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          errorType = "permission-denied";
          message = "用户拒绝了屏幕共享请求";
          break;
        case "NotFoundError":
          errorType = "no-content";
          message = "没有找到可共享的屏幕内容";
          break;
        case "AbortError":
          errorType = "aborted";
          message = "屏幕共享被意外中止";
          break;
      }
    }

    throw new ScreenCaptureError(errorType, message, {
      cause: error,
    });
  }
}

interface VideoElementOptions {
  /**
   * 是否自动播放，默认为 true
   * @default true
   */
  autoplay?: boolean;
  /**
   * 是否显示控制条，默认为 false
   * @default false
   */
  controls?: boolean;
  /**
   * 是否静音，默认为 true（避免浏览器自动播放限制）
   * @default true
   */
  muted?: boolean;
  /**
   * 父容器选择器，如果提供则自动添加到DOM
   * @example "#preview-container"
   */
  containerSelector?: string;
}

export function createVideoElementFromStream(
  stream: MediaStream,
  options: VideoElementOptions = {}
): HTMLVideoElement {
  if (!stream || !(stream instanceof MediaStream)) {
    throw new ScreenCaptureError("invalid-input", "无效的媒体流输入", {
      cause: "createVideoElementFromStream 需要有效的 MediaStream 对象",
    });
  }

  if (stream.getVideoTracks().length === 0) {
    throw new ScreenCaptureError("no-video-track", "媒体流中不包含视频轨道", {
      cause: stream,
    });
  }

  const finalOptions: VideoElementOptions = {
    autoplay: true,
    muted: true,
    controls: false,
    ...options,
  };

  const video = document.createElement("video");
  video.srcObject = stream;
  video.onloadeddata = () => {
    video.play(); // 自动播放
  };

  video.addEventListener("error", (e) => {
    console.error("视频播放错误:", e);
    video.srcObject = null;
  });

  if (finalOptions.containerSelector) {
    const container = document.querySelector(finalOptions.containerSelector);
    if (container) {
      container.appendChild(video);
    } else {
      console.warn(`未找到容器元素: ${finalOptions.containerSelector}`);
    }
  }

  return video;
}

interface CaptureAndCreateOptions extends VideoElementOptions {
  /**
   * 捕获失败时的回调
   * @param error 捕获错误对象
   */
  onError?: (error: ScreenCaptureError) => void;
  /**
   * 视频元素准备就绪时的回调
   * @param video 已配置的视频元素
   */
  onReady?: (video: HTMLVideoElement) => void;
  /**
   * 用户停止共享时的回调
   */
  onEnded?: () => void;
}

export function captureAndCreateVideo(options: CaptureAndCreateOptions = {}): {
  promise: Promise<HTMLVideoElement>;
  video?: HTMLVideoElement;
  cleanup: () => void;
} {
  let stream: MediaStream | null = null;
  let video: HTMLVideoElement | null = null;

  const cleanup = () => {
    video?.remove();
    stream?.getTracks().forEach((track) => track.stop());
    video = null;
    stream = null;
  };

  const promise = new Promise<HTMLVideoElement>(async (resolve, reject) => {
    try {
      // 1. 获取屏幕流
      stream = await captureScreenStream();

      // 2. 创建视频元素
      video = createVideoElementFromStream(stream, options);

      // 3. 绑定生命周期事件
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        options.onEnded?.();
        cleanup();
      });

      video.addEventListener("loadeddata", () => {
        options.onReady?.(video!);
        resolve(video!);
      });
    } catch (error) {
      cleanup();
      if (error instanceof ScreenCaptureError) {
        options.onError?.(error);
      }
      reject(error);
    }
  });

  return { promise, video: video || undefined, cleanup };
}
