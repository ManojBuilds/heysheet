
import React from "react";
import { FormComponent, FormTheme } from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface FormComponentPreviewProps {
  component: FormComponent;
  theme: FormTheme;
}

const FormComponentPreview: React.FC<FormComponentPreviewProps> = ({ component, theme }) => {
  switch (component.type) {
    case "short-text":
      return <Input placeholder="Short text answer" disabled />;
    case "long-text":
      return <Textarea placeholder="Long text answer" disabled />;
    case "multiple-choice":
      return (
        <div className="flex flex-col gap-2">
          {component.properties.options?.map((option: string, i: number) => (
            <div className="flex items-center gap-2" key={i}>
              <Checkbox disabled id={`${component.id}-option-${i}`} />
              <Label htmlFor={`${component.id}-option-${i}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    case "single-choice":
      return (
        <RadioGroup defaultValue="">
          {component.properties.options?.map((option: string, i: number) => (
            <div className="flex items-center gap-2" key={i}>
              <RadioGroupItem
                value={option}
                id={`${component.id}-option-${i}`}
                disabled
              />
              <Label htmlFor={`${component.id}-option-${i}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case "dropdown":
      return (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {component.properties.options?.map((option: string, i: number) => (
              <SelectItem key={i} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "email":
      return <Input type="email" placeholder="email@example.com" disabled />;
    case "phone":
      return <Input type="tel" placeholder="+1 (555) 123-4567" disabled />;
    case "number":
      return <Input type="number" placeholder="0" disabled />;
    case "date":
      return <Input type="date" disabled />;
    case "rating":
      return (
        <div className="flex gap-1">
          {Array.from({ length: component.properties.maxRating || 5 }).map(
            (_, i) => (
              <Button key={i} variant="outline" size="icon" disabled>
                <Star className="h-4 w-4" />
              </Button>
            )
          )}
        </div>
      );
    // case "file-upload":
    //   return (
    //     <div className="border-2 border-dashed rounded-md p-4 text-center text-muted-foreground">
    //       <p>Click or drop files here</p>
    //     </div>
    //   );
    default:
      return null;
  }
};

export default FormComponentPreview;
