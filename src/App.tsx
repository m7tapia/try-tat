import { ControlPanel } from "./components/ControlPanel";
import { EditorCanvas } from "./components/EditorCanvas";
import { PageLayout } from "./components/PageLayout";
import { useEditor } from "./hooks/useEditor";
import { Analytics } from "@vercel/analytics/react";


export function App() {
  const editor = useEditor();

  return (
    <PageLayout>
      <section className="editor" aria-label="Tattoo preview editor">
        <EditorCanvas
          photo={editor.photo}
          tattoo={editor.tattoo}
          transform={editor.transform}
          photoRect={editor.photoRect}
          ready={editor.ready}
          dragging={editor.dragging}
          workspaceRef={editor.workspaceRef}
          photoRef={editor.photoRef}
          onDragStart={editor.startDragging}
          onDragMove={editor.updatePosition}
          onDragEnd={editor.stopDragging}
        />

        <ControlPanel
          photo={editor.photo}
          tattoo={editor.tattoo}
          isConvertingPhoto={editor.isConvertingPhoto}
          transform={editor.transform}
          error={editor.error}
          ready={editor.ready}
          photoInputRef={editor.photoInputRef}
          tattooInputRef={editor.tattooInputRef}
          onChooseAsset={(event, role) => void editor.chooseAsset(event, role)}
          onTransformChange={editor.updateTransform}
        />
      </section>

    <Analytics />
    </PageLayout>
  );
}
