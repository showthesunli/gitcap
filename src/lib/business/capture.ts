/**
 * 屏幕捕捉核心功能模块
 * 
 * 包含屏幕流捕获、视频元素创建等基础功能
 * 封装浏览器媒体设备API，提供屏幕捕捉相关工具函数
 */

/**
 * 捕获屏幕内容并返回媒体流
 * 
 * @remarks
 * 使用浏览器的getDisplayMedia API进行屏幕捕捉，默认30帧无音频
 *
 * @returns 包含屏幕内容的媒体流Promise
 * @throws 当浏览器不支持屏幕捕捉或用户拒绝权限时抛出错误
 */
export async function captureScreen(): Promise<MediaStream> {
  try {
    // 检查浏览器是否支持屏幕捕捉API
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new Error("浏览器不支持屏幕捕捉功能");
    }

    // 请求屏幕共享权限并获取媒体流
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: 30, // 设置理想帧率为30fps（实际帧率取决于系统和硬件）
      },
      audio: false, // 显式禁用音频捕获
    });
  } catch (error) {
    // 将原始错误转换为更友好的错误信息
    throw new Error(
      `屏幕捕捉失败：${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * 创建并配置用于显示屏幕捕捉流的视频元素
 *
 * @param options 视频元素配置选项
 * @returns 绑定屏幕捕捉流的视频元素Promise
 *
 * @example
 * createScreenCaptureVideo().then(video => {
 *   document.body.appendChild(video);
 * });
 */
export async function createScreenCaptureVideo(
  options: { autoplay?: boolean; controls?: boolean; muted?: boolean } = {}
): Promise<HTMLVideoElement> {
  const video = document.createElement("video");

  // 设置默认视频属性（自动播放和静音以避免浏览器策略限制）
  video.autoplay = options.autoplay ?? true;
  video.controls = options.controls ?? false;
  video.muted = options.muted ?? true;

  try {
    // 获取屏幕捕捉流并绑定到视频元素
    const stream = await captureScreen();
    video.srcObject = stream;

    // 等待视频元数据加载
    await new Promise((resolve) =>
      video.addEventListener("loadedmetadata", resolve, { once: true })
    );

    // 设置视频尺寸（固定宽度500，高度按比例）
    video.width = video.videoWidth;
    video.height = video.videoHeight;

    // 流结束时自动清理资源
    stream.getVideoTracks()[0].addEventListener("ended", () => {
      video.srcObject = null;
    });

    video.play();

    return video;
  } catch (error) {
    // 不再尝试从DOM中移除视频元素
    throw error;
  }
}
