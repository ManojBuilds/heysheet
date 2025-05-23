"use client";
import React, { useEffect } from "react";
import { FormComponent, FormComponentType } from "@/types/form-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Trash, Plus } from "lucide-react";

interface ComponentSettingsSidebarProps {
  component: FormComponent | null;
  onClose: () => void;
  onSave: (component: FormComponent) => void;
  onDelete: (componentId: string) => void;
}

const ComponentSettingsSidebar: React.FC<ComponentSettingsSidebarProps> = ({
  component,
  onClose,
  onSave,
  onDelete,
}) => {
  const [localComponent, setLocalComponent] =
    React.useState<FormComponent | null>(component);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  if (!localComponent) return null;

  const handleChange = (field: keyof FormComponent, value: any) => {
    setLocalComponent((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handlePropertyChange = (key: string, value: any) => {
    setLocalComponent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: value,
        },
      };
    });
  };

  const handleAddOption = () => {
    if (!localComponent || !Array.isArray(localComponent.properties.options))
      return;

    handlePropertyChange("options", [
      ...localComponent.properties.options,
      `Option ${localComponent.properties.options.length + 1}`,
    ]);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!localComponent || !Array.isArray(localComponent.properties.options))
      return;

    const newOptions = [...localComponent.properties.options];
    newOptions[index] = value;
    handlePropertyChange("options", newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (!localComponent || !Array.isArray(localComponent.properties.options))
      return;

    const newOptions = localComponent.properties.options.filter(
      (_, i) => i !== index
    );
    handlePropertyChange("options", newOptions);
  };

  const handleSave = () => {
    if (localComponent) {
      onSave(localComponent);
      // onClose();
    }
  };

  const handleDelete = () => {
    if (localComponent) {
      onDelete(localComponent.id);
      onClose();
    }
  };

  const renderOptionFields = () => {
    // TODO:
    if (
      !localComponent ||
      !["multiple-choice", "single-choice", "dropdown"].includes(
        localComponent.type
      ) ||
      !Array.isArray(localComponent.properties.options)
    ) {
      return null;
    }

    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <Label>Options</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddOption}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {localComponent.properties.options.map(
            (option: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const renderRatingSettings = () => {
    if (!localComponent || localComponent.type !== "rating") {
      return null;
    }

    return (
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="max-rating">Maximum Rating</Label>
          <Input
            id="max-rating"
            type="number"
            min="1"
            max="10"
            value={localComponent.properties.maxRating || 5}
            onChange={(e) =>
              handlePropertyChange("maxRating", Number(e.target.value))
            }
          />
        </div>
      </div>
    );
  };

  const renderNumberSettings = () => {
    if (!localComponent || localComponent.type !== "number") {
      return null;
    }

    return (
      <div className="space-y-4 mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-value">Minimum</Label>
          <Input
            id="min-value"
            type="number"
            value={localComponent.properties.min || 0}
            onChange={(e) =>
              handlePropertyChange("min", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max-value">Maximum</Label>
          <Input
            id="max-value"
            type="number"
            value={localComponent.properties.max || 100}
            onChange={(e) =>
              handlePropertyChange("max", Number(e.target.value))
            }
          />
        </div>
      </div>
    );
  };
    // Add this type-specific settings renderer
  const renderTypeSpecificSettings = () => {
    if (!localComponent) return null;
    // TODO:

    switch (localComponent.type) {
      case "long-text":
      case "short-text":
      case "email":
      case "phone":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={localComponent.properties.placeholder || ""}
                onChange={(e) =>
                  handlePropertyChange("placeholder", e.target.value)
                }
                placeholder="Enter placeholder text"
              />
            </div>
          </div>
        );

      // case "file":
      //   return (
      //     <div className="space-y-4 mt-4">
      //       <div className="space-y-2">
      //         <Label htmlFor="maxSize">Max File Size (MB)</Label>
      //         <Input
      //           id="maxSize"
      //           type="number"
      //           value={localComponent.properties.maxSize || 5}
      //           onChange={(e) => handlePropertyChange("maxSize", Number(e.target.value))}
      //         />
      //       </div>
      //       <div className="space-y-2">
      //         <Label htmlFor="allowedTypes">Allowed File Types</Label>
      //         <Select
      //           value={localComponent.properties.allowedTypes?.[0] || "image/*"}
      //           onValueChange={(value) => handlePropertyChange("allowedTypes", [value])}
      //         >
      //           <SelectTrigger>
      //             <SelectValue placeholder="Select file type" />
      //           </SelectTrigger>
      //           <SelectContent>
      //             <SelectItem value="image/*">Images</SelectItem>
      //             <SelectItem value="application/pdf">PDF</SelectItem>
      //             <SelectItem value="*">All Files</SelectItem>
      //           </SelectContent>
      //         </Select>
      //       </div>
      //     </div>
      //   );

      case "date":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="format">Date Format</Label>
              <Select
                value={localComponent.properties.format || "MM/DD/YYYY"}
                onValueChange={(value) => handlePropertyChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
    }

    return null;
  };

  return (
    <div className="w-[400px] h-[calc(100svh-70px)] border-l flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Question Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <p className="text-sm text-muted-foreground">Please update this property this will be used when submitting form </p>
            <Input
              id="name"
              value={localComponent.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              value={localComponent.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={localComponent.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add a description..."
            />
          </div>
          {/* Type-specific settings */}
          {renderTypeSpecificSettings()}
          {renderOptionFields()}
          {renderRatingSettings()}
          {renderNumberSettings()}

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required</Label>
            <Switch
              id="required"
              checked={localComponent.required}
              onCheckedChange={(checked) => handleChange("required", checked)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-500 gap-1"
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSettingsSidebar;
