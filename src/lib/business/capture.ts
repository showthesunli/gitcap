class ScreenCaptureError extends Error {
  public readonly type: 'unsupported' | 'permission-denied' | 'no-content' | 'aborted' | 'unknown';
  public readonly cause?: unknown;

  constructor(
    type: ScreenCaptureError['type'],
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message, options);
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
