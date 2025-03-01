import { MainLayout } from "@/components/layout/MainLayout";
import { EditorToolbar } from "@/components/toolbar/EditorToolbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";
import { useEditorStore } from "@/lib/business/editorStore";
import { Toaster } from 'sonner';

/**
 * 应用主组件
 * @remarks 使用Zustand管理全局状态，替代局部状态管理
 * @returns 应用主界面
 * @example
 * ```tsx
 * <App />
 * ```
 */
function App() {
  // 使用Zustand store替代本地state
  const { canvasSize, setCanvasSize } = useEditorStore();

  return (
    <>
      <MainLayout>
        <EditorToolbar
          currentSize={canvasSize}
          onCanvasSizeChange={setCanvasSize}
        />
        <CanvasContainer {...canvasSize} />
      </MainLayout>
      <Toaster richColors />
    </>
  );
}

export default App;
