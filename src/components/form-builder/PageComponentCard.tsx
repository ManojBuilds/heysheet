"use client";
import { Edit, MoveVertical, Trash } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import FormComponentPreview from "./FormComponentPreview";
import { FormComponent, FormTheme } from "@/types/form-builder";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import RenderComponentInput from "./form-preview/RenderComponentInput";
import { useState } from "react";

interface PageComponentCardProps {
  theme: FormTheme;
  component: FormComponent;
  onEditSettings: () => void;
  onDeleteComponent: () => void;
  currentComponent: FormComponent | null;
  formId: string;
}
const PageComponentCard = ({
  theme,
  onDeleteComponent,
  onEditSettings,
  component,
  currentComponent,
  formId,
}: PageComponentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
  return (
    <Card
      className={cn("my-2 hover:bg-muted transition-all duration-200 group")}
      style={{
        borderRadius: theme.radius,
        borderColor:
          component.id === currentComponent?.id || isHovered
            ? theme.border
            : "transparent",
        backgroundColor: theme.background,
        color: theme.text,
        ...style,
      }}
      onClick={onEditSettings}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Button
              {...listeners}
              {...attributes}
              ref={setNodeRef}
              className="cursor-grab p-1 rounded flex items-center justify-center "
              variant={"ghost"}
              size={"icon"}
              style={{
                backgroundColor: theme.backgroundSecondary,
              }}
            >
              <MoveVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="flex-1">
              <div className="font-medium">
                {component.title}
                {component?.required && (
                  <span className="text-red-500"> *</span>
                )}
              </div>
              {component.description && (
                <p className="text-sm text-muted-foreground">
                  {component.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={(e) => { 
              e.stopPropagation()
              onEditSettings(); }}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={e => { 
              e.stopPropagation()
              onDeleteComponent(); }}>
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <div className="mt-2">
          {/* <FormComponentPreview component={component} theme={theme} /> */}
          <RenderComponentInput
            component={component}
            isPreview={true}
            theme={theme}
            formId={formId}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PageComponentCard;
