import { MainLayout } from "@/components/layout/MainLayout";
import { EditorToolbar } from "@/components/toolbar/EditorToolbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";

function App() {
  return (
    <MainLayout>
      <EditorToolbar />
      <CanvasContainer width={1080} height={720} />
    </MainLayout>
  );
}

export default App;
