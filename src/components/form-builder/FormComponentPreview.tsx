
import React from "react";
import { FormComponent, FormTheme } from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, Link } from "lucide-react";
import PhoneInputComponent from "@/components/form-builder/form-components/phone-number"

interface FormComponentPreviewProps {
  component: FormComponent;
  theme: FormTheme;
}

const FormComponentPreview: React.FC<FormComponentPreviewProps> = ({ component, theme }) => {
  console.log(component.properties)
  switch (component.type) {
    case "short-text":
      return <Input {...component.properties} disabled />;
    case "long-text":
      return <Textarea {...component.properties} disabled />;
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
      return <Input type="email" {...component.properties} disabled />;
    // case "phone":
    //   // return <Input type="tel" {...component.properties} disabled />;
    //   return <PhoneInputComponent />
    case "number":
      return <Input type="number" {...component.properties} disabled />;
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
    case "url":
      return (
        <div className="flex w-full items-center space-x-2">
          <Link className="h-4 w-4 text-muted-foreground" />
          <Input type="url" placeholder={component.properties.placeholder || "https://example.com"} disabled />
        </div>
      );
    case "heading":
      return (
        <h1 
          className="text-2xl font-bold"
          style={{ 
            fontSize: component.properties.fontSize || '1.75rem',
            textAlign: component.properties.alignment || 'left',
            color: component.properties.color || 'inherit'
          }}
        >
          {component.title || "Heading"}
        </h1>
      );
    case "subheading":
      return (
        <h2 
          className="text-xl font-semibold"
          style={{ 
            fontSize: component.properties.fontSize || '1.25rem',
            textAlign: component.properties.alignment || 'left',
            color: component.properties.color || 'inherit'
          }}
        >
          {component.title || "Subheading"}
        </h2>
      );
    case "paragraph":
      return (
        <p 
          className="text-base"
          style={{ 
            fontSize: component.properties.fontSize || '1rem',
            textAlign: component.properties.alignment || 'left',
            color: component.properties.color || 'inherit'
          }}
        >
          {component.description || "Enter your paragraph text here. This text can be used for instructions, explanations, or any additional information you want to provide to form respondents."}
        </p>
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
