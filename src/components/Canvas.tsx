import { FC } from "react";

/**
 * Canvas组件
 * @remarks 用于绘制和展示内容的画布区域
 * @returns Canvas渲染元素
 */
const Canvas: FC = () => {
  return (
    <div className="h-full w-full flex justify-center items-center p-6">
      <canvas
        width="1080"
        height="720"
        className="relative z-0 rounded-xl border-2 border-slate-300/50 shadow-[0_10px_50px_rgba(0,0,0,0.08)] backdrop-blur-sm"
        id="c"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
        }}
      ></canvas>
    </div>
  );
};

export default Canvas;
