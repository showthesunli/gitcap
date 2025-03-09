import { MainLayout } from "@/components/layout/MainLayout";
import { EditorToolbar } from "@/components/toolbar/EditorToolbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { useEditorStore } from "@/lib/business/editorStore";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme/ThemeProvider";

/**
 * 应用主组件
 * @remarks 使用Zustand管理全局状态，组织新的左右布局结构
 * @returns 基于原型设计的GIF录制应用界面
 * @example
 * ```tsx
 * <App />
 * ```
 */
const App = () => {
  // 使用Zustand store替代本地state
  const { canvasSize, setCanvasSize } = useEditorStore();

  return (
    <ThemeProvider>
      <MainLayout>
        {/* 
          先传递EditorToolbar作为右侧控制面板
          再传递CanvasContainer作为左侧预览区
          顺序很重要，MainLayout会按顺序解构 
        */}
        <EditorToolbar
          onCanvasSizeChange={setCanvasSize}
        />
        <CanvasContainer {...canvasSize} />
      </MainLayout>
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}

export default App;
