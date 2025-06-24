"use client";
import useSubscription from "@/hooks/useSubscription";
import { FormComponentType } from "@/types/form-builder";
import { useDraggable } from "@dnd-kit/core";
import {
  Text, Check, ChevronDown, Mail, Phone, Hash, Calendar, Star,
  Upload, CircleCheck, File, Link, Heading, Heading2, AlignLeft, Lock
} from "lucide-react";

interface FormComponentCardProps {
  type: FormComponentType;
  label: string;
  icon: string;
  isPaid?: boolean;
  isDisabled?: boolean; // 💡 Add this
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

const FormComponentCard = ({
  type,
  label,
  icon,
  isPaid,
  isDisabled,
}: FormComponentCardProps) => {
  const {data: subscription} = useSubscription()
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: type,
    disabled: isDisabled, 
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...(!isDisabled ? listeners : {})}
      {...attributes}
      style={style}
      className={`flex items-center justify-between p-2 rounded border border-border transition-colors
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:bg-muted cursor-grab"}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
          {iconMap[icon]}
        </div>
        <span className="text-sm">{label}</span>
      </div>

      {isPaid && !(subscription?.plan) && (
        <div className="flex items-center gap-1 text-xs bg-yellow-300 text-black px-2 py-0.5 rounded-full font-medium">
          <Lock className="w-3 h-3" />
          Pro
        </div>
      )}
    </div>
  );
};

export default FormComponentCard;
