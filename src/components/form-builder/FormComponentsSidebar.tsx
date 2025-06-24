import React, { useState } from "react";
import {
  Search
} from "lucide-react";
import { FORM_COMPONENT_TYPES } from "@/lib/form-builder";
import { Input } from "@/components/ui/input";
import { DragOverlay } from "@dnd-kit/core";
import FormComponentCard from "./FormComponentCard";
import useSubscription from "@/hooks/useSubscription";

interface FormComponentsSidebarProps {
  activeId: string | null;
}

const FormComponentsSidebar: React.FC<FormComponentsSidebarProps> = ({
  activeId,
}) => {
  const { data: subscription } = useSubscription()
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComponents = FORM_COMPONENT_TYPES.sort((a, b) =>
    a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
  ).filter((component) =>
    component.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeDraggingFormComponent = filteredComponents.find(
    (c) => c.type === activeId,
  );

  return (
    <div className="h-[calc(100svh-9.5rem)] flex flex-col">
      {/* Search Header */}
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

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-1 gap-2">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((component) => (
              <FormComponentCard
                key={component.type}
                {...component}
                isPaid={component.isPaid}
                isDisabled={component.isPaid && (!subscription?.plan)} />
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No components found
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay outside scrollable container */}
      <DragOverlay>
        {activeId && activeDraggingFormComponent && !(activeDraggingFormComponent.isPaid && (subscription?.plan) ) ? (
          <FormComponentCard {...activeDraggingFormComponent} />
        ) : null}
      </DragOverlay>

    </div>
  );
};

export default FormComponentsSidebar;
