/**
 * 画布预设尺寸常量
 * @remarks 定义了常用的画布尺寸配置，可在项目中复用
 */
export const CANVAS_PRESETS = {
  default: { width: 1080, height: 720 },
  vertical: { width: 510, height: 720 },
  square: { width: 500, height: 500 },
} as const;

export type CanvasPresetKey = keyof typeof CANVAS_PRESETS;
