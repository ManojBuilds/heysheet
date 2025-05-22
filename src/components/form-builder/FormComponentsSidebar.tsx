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
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import FormComponentCard from "./FormComponentCard";

interface FormComponentsSidebarProps {
  activeId: string | null
}

const FormComponentsSidebar: React.FC<FormComponentsSidebarProps> = ({
  activeId
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = FORM_COMPONENT_TYPES.filter((component) =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDraggingFormComponent = filteredComponents.find(
    (c) => c.type === activeId
  );

  return (
    <div className="w-full h-[calc(100svh-9.5rem)]">
      <header className="pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component, index) => (
            <FormComponentCard key={component.type} {...component} />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No components found
          </div>
        )}
        <DragOverlay>
          {activeId && activeDraggingFormComponent ? (
            <FormComponentCard {...activeDraggingFormComponent} />
          ) : null}
        </DragOverlay>
      </div>
    </div>
  );
};

export default FormComponentsSidebar;
