/**
 * @file videoUtils.ts
 * @description 视频处理相关的工具函数
 */

/**
 * 计算保持宽高比的视频尺寸
 * @remarks 根据容器尺寸计算最佳的视频显示尺寸，保持原始宽高比
 * @param videoWidth - 视频原始宽度
 * @param videoHeight - 视频原始高度
 * @param containerWidth - 容器宽度
 * @param containerHeight - 容器高度
 * @returns 计算后的视频尺寸和位置信息
 */
export const calculateVideoSize = (
  videoWidth: number,
  videoHeight: number,
  containerWidth: number,
  containerHeight: number
) => {
  // 计算适合舞台的尺寸，保持视频原始宽高比
  const scaleRatio = Math.min(
    containerWidth / videoWidth,
    containerHeight / videoHeight
  );

  const scaledWidth = videoWidth * scaleRatio;
  const scaledHeight = videoHeight * scaleRatio;

  // 计算居中位置
  const x = (containerWidth - scaledWidth) / 2;
  const y = (containerHeight - scaledHeight) / 2;

  return {
    width: scaledWidth,
    height: scaledHeight,
    x,
    y,
    scaleRatio,
  };
};
