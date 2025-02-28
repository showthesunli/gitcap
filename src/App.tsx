import { MainLayout } from "@/components/layout/MainLayout";
import { EditorToolbar } from "@/components/toolbar/EditorToolbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";

function App() {
  return (
    <MainLayout
      toolbar={<EditorToolbar />}
      canvas={<CanvasContainer />}
    />
  );
}

export default App;
