import React, { SetStateAction, useState } from "react";
import {
  FormComponent,
  FormTheme,
  FormPage,
  FormData,
} from "@/types/form-builder";
import { Button } from "@/components/ui/button";
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
import { Separator } from "../ui/separator";
import { SPREADSHEET_TEMPLATES } from "@/lib/spreadsheet-templates";

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
  onRemovePage: (pageId: string) => void;
  formId: string;
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
  onRemovePage,
  formId,
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
    }),
  );

  // Filter components for the current page
  const pageComponents = components.filter(
    (c) => c.pageId === activePage || !c.pageId,
  );

  const handleDeleteComponent = (id: string) => {
    const newComponents = components.filter((c) => c.id !== id);
    onUpdateComponents(newComponents);
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
          (c) => c.id === active.id,
        );
        const newIndex = formData.components.findIndex((c) => c.id === over.id);
        const newComponents = arrayMove(
          formData.components,
          oldIndex,
          newIndex,
        );
        return { ...formData, components: newComponents };
      });
    }
  }
  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex flex-col w-full">
          <PageTabs
            pages={pages}
            activePage={activePage}
            onChangePage={onChangePage}
            onAddPage={onAddPage}
            onRemovePage={onRemovePage}
            onClearAllPage={() => onUpdateComponents([])}
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
                    onDeleteComponent={() =>
                      handleDeleteComponent(component.id)
                    }
                    theme={theme}
                    currentComponent={currentComponent}
                    formId={formId}
                  />
                ))}
                {pageComponents.length === 0 && (
                  <div className="space-y-2 max-w-4xl mx-auto">
                    <div
                      aria-label="Drag and drop form component here"
                      className="h-52 w-full border-2 border-dashed flex flex-col items-center justify-center gap-3 bg-muted/50 shadow-inner transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        Drag and drop form elements here
                      </h3>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Start building your form by dragging components from the
                        sidebar. You can rearrange them anytime.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground justify-center">
                      OR Start with a template
                    </div>
                    <div className="space-y-2 flex flex-col max-w-sm mx-auto">
                      {Object.keys(SPREADSHEET_TEMPLATES).map((title) => (
                        <Button
                          key={title}
                          variant={"secondary"}
                          className="border-dashed"
                          onClick={() => {
                            const template =
                              SPREADSHEET_TEMPLATES[
                                title as keyof typeof SPREADSHEET_TEMPLATES
                              ];
                            onUpdateComponents(
                              template.builderConfig
                                .components as FormComponent[],
                            );
                            onUpdateFormData((prev) => ({
                              ...prev,
                              pages: template.builderConfig.pages,
                            }));
                          }}
                        >
                          {title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCanvas;
