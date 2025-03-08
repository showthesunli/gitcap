/**
 * 画布预设尺寸常量
 * @remarks 定义了常用的画布尺寸配置，可在项目中复用
 */
export const CANVAS_PRESETS = {
  default: { width: 500, height: 300 },
  vertical: { width: 400, height: 600 },
  square: { width: 500, height: 500 },
} as const;

export type CanvasPresetKey = keyof typeof CANVAS_PRESETS;
