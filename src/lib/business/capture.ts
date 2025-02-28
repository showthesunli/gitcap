/**
 * 获取屏幕共享媒体流
 * @returns 包含屏幕视频轨道的媒体流
 * @throws 当浏览器不支持或用户拒绝时会抛出错误
 * 
 * 使用说明：
 * 1. 必须在安全上下文（HTTPS/localhost）中运行
 * 2. 需要在用户交互事件（如点击）中触发
 * 3. 返回的流需要手动管理资源释放
 */
export async function captureScreenStream(): Promise<MediaStream> {
  // 浏览器兼容性检查（Safari等旧浏览器可能不支持）
  if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
    throw new Error("当前浏览器不支持屏幕共享功能");
  }

  try {
    // 发起屏幕共享请求（浏览器会弹出选择窗口）
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,  // 自动选择最佳分辨率（通常为显示器原生分辨率）
      audio: false, // 不捕获系统音频（设为true需要处理音频权限）
    });

    // 监听视频轨道结束事件（用户点击浏览器自带的停止按钮）
    stream.getVideoTracks()[0].onended = () => {
      console.log("用户已停止屏幕共享");
      // 建议在此处添加资源清理逻辑：
      // 1. 停止所有轨道
      // 2. 移除视频元素绑定
      // 3. 更新UI状态
    };

    return stream;
  } catch (error) {
    // 统一错误处理（将浏览器原生错误转换为友好提示）
    let errorMessage = "屏幕捕获失败";

    if (error instanceof DOMException) {
      switch (error.name) {
        case "NotAllowedError":
          errorMessage = "用户拒绝了屏幕共享请求";
          break;
        case "NotFoundError": // 当用户关闭选择窗口时触发
          errorMessage = "没有选择要共享的内容";
          break;
        case "AbortError":    // 设备意外中断（如拔掉显示器）
          errorMessage = "屏幕共享被意外中止"; 
          break;
      }
    }

    // 抛出统一格式的错误对象
    throw new Error(errorMessage, { cause: error });
  }
}
