import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../ui/button";

export default function Draggable(props: {
  children: React.ReactNode;
  id: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${props.id}`,
  });
  console.log(transform)

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <Button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </Button>
  );
}
