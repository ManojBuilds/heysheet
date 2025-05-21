import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Text,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Hash,
  Calendar,
  Star,
  Upload,
  CircleCheck,
  Search,
} from "lucide-react";
import { FORM_COMPONENT_TYPES } from "@/lib/form-builder";
import { FormComponentType } from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { useDraggable } from "@dnd-kit/core";
import FormComponentCard from "./FormComponentCard";

interface FormComponentsSidebarProps {
  onDragStart: (type: FormComponentType) => void;
}

const FormComponentsSidebar: React.FC<FormComponentsSidebarProps> = ({
  onDragStart,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragEnd = (result: any) => {
    // This is a sidebar, so we don't need to reorder anything
    // But we can trigger the onDragStart callback when an item is dragged
    if (!result.destination) return;

    const componentType = result.draggableId.split("-")[1] as FormComponentType;
    onDragStart(componentType);
  };

  const filteredComponents = FORM_COMPONENT_TYPES.filter((component) =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Form Components</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component, index) => (
           <FormComponentCard {...component}/> 
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No components found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormComponentsSidebar;
