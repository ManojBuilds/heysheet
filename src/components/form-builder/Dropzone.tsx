
import React from "react";

interface DropZoneProps {
  index: number;
  isActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  isEmpty?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({
  index,
  isActive,
  onDragOver,
  onDragLeave,
  onDrop,
  isEmpty = false,
}) => {
  return (
    <div
      className={`form-builder-drop-zone rounded-md ${
        isActive ? "active border-2 border-dashed border-primary p-6" : "border border-transparent p-4"
      } ${isEmpty ? "flex items-center justify-center py-8" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      Dropzone
      {/* {isEmpty && (
        <Droppable droppableId={`drop-zone-${index}`} type="SIDEBAR_COMPONENT">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`w-full text-center py-4 ${
                snapshot.isDraggingOver ? "bg-primary/10 rounded-md" : ""
              }`}
            >
              <p className="text-muted-foreground">
                Drag components here to build your form
              </p>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )} */}
    </div>
  );
};

export default DropZone;