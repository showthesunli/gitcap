export async function captureScreenStream(): Promise<MediaStream> {
  // 检查浏览器支持性
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error("当前浏览器不支持屏幕共享功能");
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
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
