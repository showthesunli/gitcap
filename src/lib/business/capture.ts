export async function captureScreenStream(
  options: MediaStreamConstraints = {
    video: { frameRate: 30, width: 1920, height: 1080 },
    audio: false
  }
): Promise<MediaStream> {
  // 检查浏览器支持性
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error("当前浏览器不支持屏幕共享功能");
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: options.video?.frameRate || 30,
        width: options.video?.width || 1920,
        height: options.video?.height || 1080,
        displaySurface: "monitor" // 可选参数：'monitor' | 'window' | 'browser'
      },
      audio: options.audio || false
    });

    // 处理用户取消共享的情况
    stream.getVideoTracks()[0].onended = () => {
      console.log("用户已停止屏幕共享");
      // 可以在这里添加清理逻辑
    };

    return stream;
  } catch (error) {
    let errorMessage = "屏幕捕获失败";
    
    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          errorMessage = "用户拒绝了屏幕共享请求";
          break;
        case "NotFoundError":
          errorMessage = "没有找到可共享的屏幕内容";
          break;
        case "AbortError":
          errorMessage = "屏幕共享被意外中止";
          break;
      }
    }
    
    throw new Error(errorMessage);
  }
}
