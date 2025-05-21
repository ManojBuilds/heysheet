import React, { act, SetStateAction, useState } from "react";
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
import ComponentSettingsSidebar from "./ComponentSettingsSidebar";
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

  const handleSaveComponent = (updatedComponent: FormComponent) => {
    const index = components.findIndex((c) => c.id === updatedComponent.id);
    if (index !== -1) {
      const newComponents = [...components];
      newComponents[index] = updatedComponent;
      onUpdateComponents(newComponents);
      toast.success("Component updated!");
    }
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
    <div className="flex flex-col w-full">
      <PageTabs
        pages={pages}
        activePage={activePage}
        onChangePage={onChangePage}
        onAddPage={onAddPage}
      />

      <div ref={setNodeRef} className="min-h-44">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext strategy={verticalListSortingStrategy} items={pageComponents}>
            {pageComponents.map((component, index) => (
              <PageComponentCard
                key={`${component.id}`}
                component={component}
                onEditSettings={() => handleOpenSettings(component)}
                onDeleteComponent={() => handleDeleteComponent(component.id)}
                theme={theme}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <Drawer
        direction="right"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <DrawerContent className="w-[400px] sm:w-[540px] p-0">
          <ComponentSettingsSidebar
            component={currentComponent}
            onClose={() => setIsDrawerOpen(false)}
            onSave={handleSaveComponent}
            onDelete={handleDeleteComponent}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

function getDefaultPropertiesForType(
  type: FormComponentType
): Record<string, any> {
  switch (type) {
    case "multiple-choice":
    case "single-choice":
    case "dropdown":
      return { options: ["Option 1", "Option 2", "Option 3"] };
    case "rating":
      return { maxRating: 5 };
    case "number":
      return { min: 0, max: 100 };
    default:
      return {};
  }
}

export default FormCanvas;
