class ScreenCaptureError extends Error {
  public readonly type: 
    | 'unsupported' 
    | 'permission-denied' 
    | 'no-content' 
    | 'aborted' 
    | 'invalid-input'
    | 'no-video-track'
    | 'unknown';
  public readonly cause?: unknown;

  constructor(
    type: ScreenCaptureError['type'],
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = 'ScreenCaptureError';
    this.type = type;
    this.cause = options?.cause;
    Object.setPrototypeOf(this, ScreenCaptureError.prototype);
  }
}

export async function captureScreenStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new ScreenCaptureError(
      'unsupported',
      '当前浏览器不支持屏幕共享功能'
    );
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
    let errorType: ScreenCaptureError['type'] = 'unknown';
    let message = "屏幕捕获失败";

    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          errorType = 'permission-denied';
          message = "用户拒绝了屏幕共享请求";
          break;
        case "NotFoundError":
          errorType = 'no-content';
          message = "没有找到可共享的屏幕内容";
          break;
        case "AbortError":
          errorType = 'aborted';
          message = "屏幕共享被意外中止";
          break;
      }
    }

    throw new ScreenCaptureError(errorType, message, {
      cause: error
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
    throw new ScreenCaptureError(
      'invalid-input', 
      '无效的媒体流输入',
      { cause: 'createVideoElementFromStream 需要有效的 MediaStream 对象' }
    );
  }

  if (stream.getVideoTracks().length === 0) {
    throw new ScreenCaptureError(
      'no-video-track', 
      '媒体流中不包含视频轨道',
      { cause: stream }
    );
  }

  const finalOptions: VideoElementOptions = {
    autoplay: true,
    muted: true,
    controls: false,
    ...options
  };

  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = finalOptions.autoplay;
  video.controls = finalOptions.controls;
  video.muted = finalOptions.muted;

  video.addEventListener('error', (e) => {
    console.error('视频播放错误:', e);
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
