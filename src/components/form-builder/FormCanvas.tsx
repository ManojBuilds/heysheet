import React, { SetStateAction, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FormComponent,
  FormComponentType,
  FormTheme,
  FormPage,
  FormData,
} from "@/types/form-builder";
import { Button } from "@/components/ui/button";
import { Trash, Edit, MoveVertical } from "lucide-react";
import { toast } from "sonner";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import FormComponentPreview from "./FormComponentPreview";
import DropZone from "./Dropzone";
import PageTabs from "./PageTabs";
import PageComponentCard from "./PageComponentCard";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import ComponentSettingsSidebar from "./ComponentSettingsSidebar";

interface FormCanvasProps {
  components: FormComponent[];
  theme: FormTheme;
  pages: FormPage[];
  activePage: string;
  onUpdateComponents: (components: FormComponent[]) => void;
  onEditComponent: (component: FormComponent) => void;
  onAddPage: () => void;
  onChangePage: (pageId: string) => void;
  onUpdateFormData: React.Dispatch<SetStateAction<FormData>>;
  onRemovePage: (pageId: string)=>void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  components,
  theme,
  pages,
  activePage,
  onUpdateComponents,
  onEditComponent,
  onAddPage,
  onChangePage,
  onUpdateFormData,
  onRemovePage
}) => {
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });
  const [currentComponent, setCurrentComponent] =
    useState<FormComponent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter components for the current page
  const pageComponents = components.filter(
    (c) => c.pageId === activePage || !c.pageId
  );

  const handleDeleteComponent = (id: string) => {
    const newComponents = components.filter((c) => c.id !== id);
    onUpdateComponents(newComponents);
    toast.success("Component deleted!");
  };

  const handleOpenSettings = (component: FormComponent) => {
    setCurrentComponent(component);
    setIsDrawerOpen(true);
    onEditComponent(component);
  };


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log("Reorder :", active.id, over?.id);

    if (!over) return;
    if (active.id !== over?.id) {
      onUpdateFormData((formData) => {
        const oldIndex = formData.components.findIndex(
          (c) => c.id === active.id
        );
        const newIndex = formData.components.findIndex((c) => c.id === over.id);
        const newComponents = arrayMove(
          formData.components,
          oldIndex,
          newIndex
        );
        return { ...formData, components: newComponents };
      });
    }
  }
  return (
    <div className="flex">
      {/* Main Form Canvas */}
      <div className="flex-1">
        <div className="flex flex-col w-full">
          <PageTabs
            pages={pages}
            activePage={activePage}
            onChangePage={onChangePage}
            onAddPage={onAddPage}
            onRemovePage={onRemovePage}
          />

          <div ref={setNodeRef} className="min-h-44">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                strategy={verticalListSortingStrategy}
                items={pageComponents}
              >
                {pageComponents?.map((component) => (
                  <PageComponentCard
                    key={`${component.id}`}
                    component={component}
                    onEditSettings={() => handleOpenSettings(component)}
                    onDeleteComponent={() => handleDeleteComponent(component.id)}
                    theme={theme}
                    currentComponent={currentComponent}
                  />
                ))}
                {
                  pageComponents.length === 0 && (
                    <div
                      aria-label="Drag and drop form component here"
                      className="h-52 w-full border-2 border-dashed flex flex-col items-center justify-center gap-3 bg-muted/50 shadow-inner transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        Drag and drop form elements here
                      </h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Start building your form by dragging components from the sidebar. You can rearrange them anytime.
                      </p>
                    </div>
                  )
                }
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
     
    </div>
  );
};


export default FormCanvas;
