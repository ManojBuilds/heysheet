"use client";
import { FormComponentType } from "@/types/form-builder";
import { useDraggable } from "@dnd-kit/core";
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
  File,
  Link,
  Heading,
  Heading2,
  AlignLeft
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

interface FormComponentCardProps {
  type: FormComponentType;
  label: string;
  icon: string;
}
const iconMap: Record<string, React.ReactNode> = {
  text: <Text className="h-5 w-5" />,
  check: <Check className="h-5 w-5" />,
  "circle-check": <CircleCheck className="h-5 w-5" />,
  "chevron-down": <ChevronDown className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  phone: <Phone className="h-5 w-5" />,
  hash: <Hash className="h-5 w-5" />,
  calendar: <Calendar className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  upload: <Upload className="h-5 w-5" />,
  file: <File className="h-5 w-5" />,
  link: <Link className="h-5 w-5" />,
  heading: <Heading className="h-5 w-5" />,
  "heading-2": <Heading2 className="h-5 w-5" />,
  "align-left": <AlignLeft className="h-5 w-5" />,
};

const FormComponentCard = ({ type, label, icon }: FormComponentCardProps) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: type,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <div
      key={type}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 p-2 rounded border border-border hover:bg-muted cursor-grab transition-colors`}
      style={style}
    >
      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
        {iconMap[icon]}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default FormComponentCard;
