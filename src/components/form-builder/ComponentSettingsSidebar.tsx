"use client";
import React, { useEffect } from "react";
import { FormComponent } from "@/types/form-builder";
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

import { useDebouncedCallback } from "use-debounce";
import { ALLOWED_FILE_TYPES } from "@/lib/utils";


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

  const debouncedSaveComponent = useDebouncedCallback(() => {
    if (!localComponent) return;
    onSave(localComponent);
  }, 500);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  useEffect(() => {
    debouncedSaveComponent();
  }, [localComponent, debouncedSaveComponent]);

  if (!localComponent) return null;

  const handleChange = (field: keyof FormComponent, value: any) => {
    setLocalComponent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handlePropertyChange = (key: string, value: any) => {
    setLocalComponent((prev) =>
      prev
        ? {
            ...prev,
            properties: {
              ...prev.properties,
              [key]: value,
            },
          }
        : prev,
    );
  };

  // Option handlers (for dropdown, single-choice, multiple-choice)
  const handleAddOption = () => {
    if (!Array.isArray(localComponent?.properties.options)) return;
    handlePropertyChange("options", [
      ...localComponent.properties.options,
      `Option ${localComponent.properties.options.length + 1}`,
    ]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(localComponent?.properties.options || [])];
    newOptions[index] = value;
    handlePropertyChange("options", newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const filtered = localComponent?.properties.options?.filter(
      (_: any, i: number) => i !== index,
    );
    handlePropertyChange("options", filtered);
  };

  // Render option fields for choice components
  const renderOptionFields = () =>
    ["dropdown", "single-choice", "multiple-choice"].includes(
      localComponent.type,
    ) ? (
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <Label>Options</Label>
          <Button size="sm" variant="outline" onClick={handleAddOption}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {localComponent.properties.options?.map((opt: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  // Rating settings
  const renderRatingSettings = () =>
    localComponent.type === "rating" ? (
      <div className="mt-4 space-y-2">
        <Label>Max Rating</Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={localComponent.properties.maxRating || 5}
          onChange={(e) =>
            handlePropertyChange("maxRating", Number(e.target.value))
          }
        />
      </div>
    ) : null;

  // Number min/max settings
  const renderNumberSettings = () =>
    localComponent.type === "number" ? (
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min</Label>
          <Input
            type="number"
            value={localComponent.properties.min || 0}
            onChange={(e) =>
              handlePropertyChange("min", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max</Label>
          <Input
            type="number"
            value={localComponent.properties.max || 100}
            onChange={(e) =>
              handlePropertyChange("max", Number(e.target.value))
            }
          />
        </div>
      </div>
    ) : null;

  // Placeholder for text-like inputs
  const renderTextSettings = () => (
    <div className="mt-4 space-y-2">
      <Label>Placeholder</Label>
      <Input
        value={localComponent.properties.placeholder || ""}
        onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
        placeholder="Enter placeholder"
      />
    </div>
  );

  // Date format settings
  const renderDateSettings = () =>
    localComponent.type === "date" ? (
      <div className="mt-4 space-y-2">
        <Label>Date Format</Label>
        <Select
          value={localComponent.properties.format || "MM/DD/YYYY"}
          onValueChange={(v) => handlePropertyChange("format", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ) : null;

  // File upload settings
  const renderFileSettings = () =>
    localComponent.type === "file" ? (
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>Max File Size (MB)</Label>
          <Input
            type="number"
            value={localComponent.properties.maxSize || 5}
            onChange={(e) =>
              handlePropertyChange("maxSize", Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Allowed File Type</Label>
          <Select
            value={localComponent.properties.allowedTypes?.[0] || "*"}
            onValueChange={(value) =>
              handlePropertyChange("allowedTypes", [value])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="File type" />
            </SelectTrigger>
            <SelectContent>
              {ALLOWED_FILE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ) : null;

  // URL settings
  const renderUrlSettings = () =>
    localComponent.type === "url" ? (
      <div className="mt-4 space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={localComponent.properties.placeholder || "https://example.com"}
          onChange={(e) => handlePropertyChange("placeholder", e.target.value)}
          placeholder="Enter placeholder"
        />
      </div>
    ) : null;

  // Text display settings (for heading, subheading, paragraph)
  const renderTextDisplaySettings = () =>
    ["heading", "subheading", "paragraph"].includes(localComponent.type) ? (
      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label>
            Font Size ({localComponent.type === "heading" ? "rem" : "rem"})
          </Label>
          <Input
            type="text"
            value={
              localComponent.properties.fontSize ||
              (localComponent.type === "heading"
                ? "1.75rem"
                : localComponent.type === "subheading"
                  ? "1.25rem"
                  : "1rem")
            }
            onChange={(e) => handlePropertyChange("fontSize", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <Select
            value={localComponent.properties.alignment || "left"}
            onValueChange={(value) => handlePropertyChange("alignment", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Text Color</Label>
          <Input
            type="color"
            value={localComponent.properties.color}
            onChange={(e) => handlePropertyChange("color", e.target.value)}
            className="h-10 w-full"
          />
        </div>
      </div>
    ) : null;

  const renderTypeSpecificSettings = () => {
    switch (localComponent.type) {
      case "short-text":
      case "long-text":
      case "email":
      case "phone":
        return renderTextSettings();
      case "url":
        return renderUrlSettings();
      case "date":
        return renderDateSettings();
      case "file":
        return renderFileSettings();
      case "heading":
      case "subheading":
      case "paragraph":
        return renderTextDisplaySettings();
      default:
        return null;
    }
  };

  return (
    <div className="w-[400px] h-[calc(100svh-70px)] border-l bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Question Settings</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main */}
      <div className="p-4 overflow-auto flex-1 space-y-4">
        {!["heading", "subheading", "paragraph"].includes(
          localComponent.type,
        ) && (
          <div className="space-y-2">
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={localComponent.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>
            {["heading", "subheading", "paragraph"].includes(
              localComponent.type,
            )
              ? "Text Content"
              : "Title"}
          </Label>
          <Input
            value={
              ["heading", "subheading", "paragraph"].includes(
                localComponent.type,
              )
                ? localComponent.properties.content
                : localComponent.title
            }
            onChange={(e) =>
              ["heading", "subheading", "paragraph"].includes(
                localComponent.type,
              )
                ? handleChange("properties", {
                    ...localComponent.properties,
                    content: e.target.value,
                  })
                : handleChange("title", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          {localComponent.type !== "paragraph" && (
            <>
              <Label>Description</Label>
              <Textarea
                value={localComponent.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </>
          )}
        </div>

        {renderTypeSpecificSettings()}
        {renderOptionFields()}
        {renderRatingSettings()}
        {renderNumberSettings()}

        {!["heading", "subheading", "paragraph"].includes(
          localComponent.type,
        ) && (
          <div className="flex justify-between items-center pt-4 border-t">
            <Label>Required</Label>
            <Switch
              checked={localComponent.required}
              onCheckedChange={(v) => handleChange("required", v)}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4 flex justify-between items-center">
        <Button
          variant="destructive"
          onClick={() => {
            onDelete(localComponent.id);
            onClose();
          }}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {/* <Button onClick={() => onSave(localComponent)}>Save Changes</Button> */}
        </div>
      </div>
    </div>
  );
};

export default ComponentSettingsSidebar;
