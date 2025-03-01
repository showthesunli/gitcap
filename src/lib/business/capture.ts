/**
 * 屏幕捕获模块
 * @remarks 提供浏览器屏幕捕获功能，用于创建和管理屏幕共享流
 */

/**
 * 屏幕捕获错误类
 * @remarks 封装屏幕捕获过程中可能出现的各种错误类型
 */
class ScreenCaptureError extends Error {
  /**
   * 错误类型
   * @remarks
   * - unsupported: 浏览器不支持
   * - permission-denied: 用户拒绝授权
   * - no-content: 未选择共享内容
   * - aborted: 操作被中止
   * - invalid-input: 无效输入参数
   * - no-video-track: 没有视频轨道
   * - unknown: 未知错误
   */
  public readonly type:
    | "unsupported"
    | "permission-denied"
    | "no-content"
    | "aborted"
    | "invalid-input"
    | "no-video-track"
    | "unknown";
  
  /**
   * 原始错误对象
   */
  public readonly cause?: unknown;

  /**
   * 创建屏幕捕获错误实例
   * @param type - 错误类型
   * @param message - 错误消息
   * @param options - 附加选项，可包含原始错误
   */
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

/**
 * 屏幕捕获配置接口
 * @remarks 定义捕获屏幕时的视频和音频配置
 */
interface CaptureConfig {
  /** 视频轨道约束，或布尔值表示是否启用视频 */
  video?: MediaTrackConstraints | boolean;
  /** 是否捕获音频 */
  audio?: boolean;
}

/**
 * 捕获屏幕媒体流
 * @remarks 使用浏览器原生API请求屏幕共享权限并获取媒体流
 * @param config - 捕获配置选项
 * @returns 包含屏幕内容的媒体流Promise
 * @throws {ScreenCaptureError} 当屏幕捕获失败时抛出
 * @example
 * ```ts
 * try {
 *   const stream = await captureScreenStream({ video: true, audio: false });
 *   // 使用媒体流
 * } catch (error) {
 *   console.error('捕获失败:', error.message);
 * }
 * ```
 */
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
      stream.getTracks().forEach((track) => track.stop());
      throw new ScreenCaptureError("no-video-track", "未捕获到视频轨道");
    }

    videoTrack.onended = () => {
      console.log("屏幕共享已停止");
      stream.getTracks().forEach((track) => track.stop());
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

/**
 * 视频元素创建选项接口
 * @remarks 定义从媒体流创建视频元素时的选项
 */
interface VideoElementOptions {
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否显示控制栏 */
  controls?: boolean;
  /** 是否静音 */
  muted?: boolean;
  /** 视频元素的容器 */
  container?: HTMLElement | string;
}

/**
 * 从媒体流创建视频元素
 * @remarks 创建一个HTML视频元素并关联媒体流
 * @param stream - 媒体流对象
 * @param options - 视频元素选项
 * @returns 包含媒体流的HTML视频元素Promise
 * @throws {ScreenCaptureError} 当视频元素创建失败时抛出
 * @example
 * ```ts
 * const stream = await captureScreenStream();
 * const video = await createVideoElement(stream, { muted: true });
 * document.body.appendChild(video);
 * ```
 */
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
    container,
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
      const parent =
        typeof container === "string"
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
    stream.getTracks().forEach((track) => track.stop());
    throw error instanceof ScreenCaptureError
      ? error
      : new ScreenCaptureError("unknown", "视频元素创建失败", { cause: error });
  }
}

/**
 * 启动屏幕捕获
 * @remarks 组合捕获屏幕和创建视频元素的功能，提供一站式屏幕捕获解决方案
 * @param options - 捕获和视频选项
 * @returns 包含视频元素和停止函数的对象Promise
 * @throws {ScreenCaptureError} 当屏幕捕获或视频创建失败时抛出
 * @example
 * ```ts
 * try {
 *   const { video, stop } = await startScreenCapture();
 *   document.getElementById('container').appendChild(video);
 *   
 *   // 停止捕获
 *   setTimeout(stop, 10000); // 10秒后停止
 * } catch (error) {
 *   console.error('屏幕捕获启动失败:', error.message);
 * }
 * ```
 */
export async function startScreenCapture(
  options: {
    /** 捕获配置 */
    capture?: CaptureConfig;
    /** 视频元素选项 */
    video?: VideoElementOptions;
  } = {}
): Promise<{ video: HTMLVideoElement; stop: () => void }> {
  try {
    const stream = await captureScreenStream(options.capture);
    const video = await createVideoElement(stream, options.video);

    /**
     * 停止捕获功能
     * @remarks 停止所有媒体轨道并移除视频元素
     */
    const stop = () => {
      video.pause();
      video.remove();
      stream.getTracks().forEach((track) => track.stop());
    };

    return { video, stop };
  } catch (error) {
    if (error instanceof ScreenCaptureError) {
      console.error(`捕获失败 (${error.type}):`, error.message);
    }
    throw error;
  }
}
