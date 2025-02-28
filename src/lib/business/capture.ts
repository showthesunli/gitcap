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
    super(message, options);
    this.name = "ScreenCaptureError";
    this.type = type;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, ScreenCaptureError.prototype);
  }
}

interface CaptureConfig {
  video?: MediaTrackConstraints;
  audio?: boolean;
}

export async function captureScreenStream(
  config: CaptureConfig = { video: true, audio: false }
): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new ScreenCaptureError("unsupported", "当前浏览器不支持屏幕共享功能");
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: config.video,
      audio: config.audio,
    });

    const [videoTrack] = stream.getVideoTracks();
    if (!videoTrack) {
      stream.getTracks().forEach(track => track.stop());
      throw new ScreenCaptureError("no-video-track", "未捕获到视频轨道");
    }

    videoTrack.onended = () => {
      console.log("屏幕共享已停止");
      stream.getTracks().forEach(track => track.stop());
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
          message = "未选择共享内容";
          break;
        case "AbortError":
          errorType = "aborted";
          message = "共享被意外中止";
          break;
      }
    }

    throw new ScreenCaptureError(errorType, message, { cause: error });
  }
}

interface VideoElementOptions {
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  container?: HTMLElement | string;
}

export async function createVideoElement(
  stream: MediaStream,
  options: VideoElementOptions = {}
): Promise<HTMLVideoElement> {
  if (!stream?.active) {
    throw new ScreenCaptureError("invalid-input", "无效的媒体流");
  }

  const video = document.createElement("video");
  const {
    autoplay = true,
    controls = false,
    muted = true,
    container
  } = options;

  try {
    video.srcObject = stream;
    video.autoplay = autoplay;
    video.controls = controls;
    video.muted = muted;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => 
        reject(new ScreenCaptureError("unknown", "视频初始化失败"));
      video.play().catch(reject);
    });

    if (container) {
      const parent = typeof container === "string" 
        ? document.querySelector(container)
        : container;
      
      if (!parent) {
        console.warn("未找到容器元素");
      } else {
        parent.append(video);
      }
    }

    return video;
  } catch (error) {
    video.remove();
    stream.getTracks().forEach(track => track.stop());
    throw error instanceof ScreenCaptureError 
      ? error
      : new ScreenCaptureError("unknown", "视频元素创建失败", { cause: error });
  }
}

export async function startScreenCapture(
  options: {
    capture?: CaptureConfig;
    video?: VideoElementOptions;
  } = {}
): Promise<{ video: HTMLVideoElement; stop: () => void }> {
  try {
    const stream = await captureScreenStream(options.capture);
    const video = await createVideoElement(stream, options.video);

    const stop = () => {
      video.pause();
      video.remove();
      stream.getTracks().forEach(track => track.stop());
    };

    return { video, stop };
  } catch (error) {
    if (error instanceof ScreenCaptureError) {
      console.error(`捕获失败 (${error.type}):`, error.message);
    }
    throw error;
  }
}
