
import React, { useState, useEffect } from "react";
import { FormComponent, FormData, FormTheme } from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface FormPreviewProps {
  formData: FormData;
  onClose: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formData, onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  // Group components by page
  const pageComponents: FormComponent[][] = [];
  
  formData.pages.forEach(page => {
    const componentsInPage = formData.components.filter(comp => comp.pageId === page.id);
    if (componentsInPage.length > 0) {
      pageComponents.push(componentsInPage);
    }
  });
  
  // If there are no pages or components not assigned to pages, add them to first page
  if (pageComponents.length === 0) {
    pageComponents.push(formData.components);
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Form submitted! Answers logged to console");
    console.log("Form answers:", answers);
    onClose();
  };
  
  const handleNext = () => {
    if (currentPageIndex < pageComponents.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      handleSubmit(new Event('submit') as any);
    }
  };
  
  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };
  
  const updateAnswer = (id: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  
  const currentPageComponents = pageComponents[currentPageIndex] || [];
  const isLastPage = currentPageIndex === pageComponents.length - 1;
  
  if (currentPageComponents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg font-medium mb-4">No questions in this form yet</p>
        <Button onClick={onClose}>Close Preview</Button>
      </div>
    );
  }
  
  return (
    <div 
      className="flex flex-col min-h-[500px] max-w-xl mx-auto"
      style={{ 
        backgroundColor: formData.theme.backgroundColor,
        color: formData.theme.textColor,
        fontFamily: formData.theme.fontFamily,
      }}
    >
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">
                Page {currentPageIndex + 1} of {pageComponents.length}
              </span>
            </div>
            <div className="text-sm">
              <span 
                className="cursor-pointer hover:underline"
                onClick={onClose}
              >
                Exit
              </span>
            </div>
          </div>
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full"
              style={{ 
                width: `${((currentPageIndex + 1) / pageComponents.length) * 100}%`,
                backgroundColor: formData.theme.primaryColor 
              }}
            ></div>
          </div>
        </div>
        
        <Card
          className="shadow-lg border-0 animate-fade-in"
          style={{ borderRadius: formData.theme.borderRadius }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-medium">
              {formData.pages[currentPageIndex]?.title || `Page ${currentPageIndex + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {currentPageComponents.map((component, index) => (
                <div key={component.id} className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{component.title}</h3>
                    {component.description && (
                      <p className="text-sm text-muted-foreground mb-2">{component.description}</p>
                    )}
                  </div>
                  {renderComponentInput(
                    component,
                    formData.theme,
                    answers[component.id],
                    (value) => updateAnswer(component.id, value)
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentPageIndex === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              style={{ 
                backgroundColor: formData.theme.primaryColor,
                color: '#fff'
              }}
            >
              {isLastPage ? "Submit" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

function renderComponentInput(
  component: FormComponent,
  theme: FormTheme,
  value: any,
  onChange: (value: any) => void
) {
  switch (component.type) {
    case "short-text":
      return (
        <Input 
          placeholder="Type your answer here"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="focus:ring-2"
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "long-text":
      return (
        <Textarea 
          placeholder="Type your answer here"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] focus:ring-2"
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "multiple-choice":
      return (
        <div className="space-y-3">
          {component.properties.options?.map((option: string, i: number) => (
            <div className="flex items-center space-x-2" key={i}>
              <Checkbox 
                id={`${component.id}-option-${i}`}
                checked={(value || []).includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(value) ? [...value] : [];
                  if (checked) {
                    onChange([...currentValues, option]);
                  } else {
                    onChange(currentValues.filter(v => v !== option));
                  }
                }}
              />
              <Label htmlFor={`${component.id}-option-${i}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    
    case "single-choice":
      return (
        <RadioGroup
          value={value || ""}
          onValueChange={onChange}
          className="space-y-3"
        >
          {component.properties.options?.map((option: string, i: number) => (
            <div className="flex items-center space-x-2" key={i}>
              <RadioGroupItem
                value={option}
                id={`${component.id}-option-${i}`}
              />
              <Label htmlFor={`${component.id}-option-${i}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    
    case "dropdown":
      return (
        <Select
          value={value || ""}
          onValueChange={onChange}
        >
          <SelectTrigger
            style={{ 
              borderColor: theme.primaryColor + "40",
              borderRadius: theme.borderRadius
            }}
          >
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
      return (
        <Input
          type="email"
          placeholder="email@example.com"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "phone":
      return (
        <Input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "number":
      return (
        <Input
          type="number"
          placeholder="0"
          min={component.properties.min || undefined}
          max={component.properties.max || undefined}
          value={value || ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "date":
      return (
        <Input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
        />
      );
    
    case "rating":
      return (
        <div className="flex gap-2">
          {Array.from({ length: component.properties.maxRating || 5 }).map(
            (_, i) => (
              <Button
                key={i}
                variant="outline"
                size="icon"
                className="h-10 w-10"
                style={{
                  borderColor: theme.primaryColor + "40",
                  borderRadius: theme.borderRadius,
                  backgroundColor: value && value > i ? theme.primaryColor : undefined,
                  color: value && value > i ? "#fff" : undefined,
                }}
                onClick={() => onChange(i + 1)}
              >
                <Star className="h-5 w-5" />
              </Button>
            )
          )}
        </div>
      );
    
    // case "file-upload":
    //   return (
    //     <div
    //       className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors hover:bg-muted/50"
    //       style={{ borderColor: theme.primaryColor + "40", borderRadius: theme.borderRadius }}
    //       onClick={() => {/* file upload logic would go here */}}
    //     >
    //       <p>Click or drop files here</p>
    //       <p className="text-sm text-muted-foreground mt-2">
    //         {value ? `Selected file: ${value}` : "No file selected"}
    //       </p>
    //     </div>
    //   );
    
    default:
      return null;
  }
}

export default FormPreview;
