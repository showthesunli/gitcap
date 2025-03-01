import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EditorToolbar } from "@/components/toolbar/EditorToolbar";
import { CanvasContainer } from "@/components/canvas/CanvasContainer";

function App() {
  const [canvasSize, setCanvasSize] = useState({
    width: 1080,
    height: 720,
  });

  return (
    <MainLayout>
      <EditorToolbar
        currentSize={canvasSize}
        onCanvasSizeChange={setCanvasSize}
      />
      <CanvasContainer {...canvasSize} />
    </MainLayout>
  );
}

export default App;
