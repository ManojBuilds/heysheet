"use client";
import { Edit, MoveVertical, Trash } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import FormComponentPreview from "./FormComponentPreview";
import { FormComponent, FormTheme } from "@/types/form-builder";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface PageComponentCardProps {
  theme: FormTheme;
  component: FormComponent;
  onEditSettings: () => void;
  onDeleteComponent: () => void;
  currentComponent: FormComponent | null;
}
const PageComponentCard = ({
  theme,
  onDeleteComponent,
  onEditSettings,
  component,
  currentComponent,
}: PageComponentCardProps) => {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({
      id: component.id,
    });

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined;
    console.log(component)
  return (
    <Card
      className={cn(
        "form-builder-component my-2 shadow-none rounded-none hover:bg-muted transition-all duration-200",
        component.id === currentComponent?.id && "border border-black"
      )}
      style={{
        // borderColor: theme.primaryColor + "40",
        // borderRadius: theme.borderRadius,
        ...style,
      }}
      onClick={onEditSettings}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Button
              {...listeners}
              {...attributes}
              ref={setNodeRef}
              className="cursor-grab p-1 rounded hover:bg-muted flex items-center justify-center bg-muted"
              variant={"ghost"}
              size={"icon"}
            >
              <MoveVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex-1">
              <div className="font-medium">{component.title}{component?.required && <span className="text-red-500"> *</span>}</div>
              {component.description && (
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onEditSettings}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDeleteComponent}>
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <FormComponentPreview component={component} theme={theme} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PageComponentCard;
