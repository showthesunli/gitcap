/**
 * GIF文件操作工具模块
 * @remarks 提供GIF文件保存和下载功能
 */

/**
 * 将GIF保存为文件
 * @remarks 提供文件下载功能
 * @param gifBlob - GIF的Blob数据
 * @param filename - 文件名，默认为'recorded.gif'
 */
export const saveGifToFile = (
  gifBlob: Blob,
  filename = "recorded.gif"
): void => {
  const url = URL.createObjectURL(gifBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  // 释放URL对象
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
