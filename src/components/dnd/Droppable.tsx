'use client'
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export default function Droppable(props: {children: React.ReactNode, id: string}) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style} className='h-44 border w-44'>
      {props.children}
    </div>
  );
}