/**
 * GIF录制相关类型定义
 * @remarks 提供GIF录制功能所需的接口和类型
 */

/**
 * 录制GIF配置选项接口
 */
export interface RecordGifOptions {
  /** 每秒帧数 */
  fps?: number;
  /** 质量, 1-30, 数值越小质量越高 */
  quality?: number;
  /** 录制持续时间(毫秒) - 仅在自动模式下使用 */
  duration?: number;
  /** 宽度，默认使用canvas宽度 */
  width?: number;
  /** 高度，默认使用canvas高度 */
  height?: number;
  /** 是否显示录制进度 */
  showProgress?: boolean;
  /** 进度回调函数 */
  onProgress?: (progress: number) => void;
}

/**
 * GIF录制控制器接口
 */
export interface GifRecordingController {
  /** 停止录制并获取GIF Blob数据 */
  stop: () => Promise<Blob>;
  /** 中止录制 */
  abort: () => void;
}
