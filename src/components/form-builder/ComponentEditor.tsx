
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormComponent } from "@/types/form-builder";
import { PlusCircle, X } from "lucide-react";

interface ComponentEditorProps {
  component: FormComponent | null;
  open: boolean;
  onClose: () => void;
  onSave: (component: FormComponent) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  open,
  onClose,
  onSave,
}) => {
  const [editedComponent, setEditedComponent] = useState<FormComponent | null>(
    null
  );

  useEffect(() => {
    if (component) {
      setEditedComponent({ ...component });
    }
  }, [component]);

  if (!editedComponent) {
    return null;
  }

  const handleSave = () => {
    if (editedComponent) {
      onSave(editedComponent);
    }
    onClose();
  };

  const updateProperty = (
    key: string,
    value: any,
    propertyKey?: string
  ) => {
    if (propertyKey) {
      setEditedComponent({
        ...editedComponent,
        properties: {
          ...editedComponent.properties,
          [propertyKey]: value,
        },
      });
    } else {
      setEditedComponent({
        ...editedComponent,
        [key]: value,
      });
    }
  };

  const handleAddOption = () => {
    const options = [...(editedComponent.properties.options || [])];
    options.push(`Option ${options.length + 1}`);
    updateProperty("options", options, "options");
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(editedComponent.properties.options || [])];
    options.splice(index, 1);
    updateProperty("options", options, "options");
  };

  const handleUpdateOption = (index: number, value: string) => {
    const options = [...(editedComponent.properties.options || [])];
    options[index] = value;
    updateProperty("options", options, "options");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              value={editedComponent.title}
              onChange={(e) => updateProperty("title", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={editedComponent.description || ""}
              onChange={(e) => updateProperty("description", e.target.value)}
              placeholder="Add a description to help respondents"
            />
          </div>

          {(editedComponent.type === "multiple-choice" ||
            editedComponent.type === "single-choice" ||
            editedComponent.type === "dropdown") && (
            <div className="grid gap-2">
              <Label>Options</Label>
              {editedComponent.properties.options?.map(
                (option: string, index: number) => (
                  <div className="flex items-center gap-2" key={index}>
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleUpdateOption(index, e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      disabled={editedComponent.properties.options.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          )}

          {editedComponent.type === "rating" && (
            <div className="grid gap-2">
              <Label htmlFor="maxRating">Max Rating</Label>
              <Input
                id="maxRating"
                type="number"
                min={1}
                max={10}
                value={editedComponent.properties.maxRating || 5}
                onChange={(e) =>
                  updateProperty(
                    "maxRating",
                    parseInt(e.target.value),
                    "maxRating"
                  )
                }
              />
            </div>
          )}

          {editedComponent.type === "number" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="min">Min Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={editedComponent.properties.min || 0}
                  onChange={(e) =>
                    updateProperty("min", parseInt(e.target.value), "min")
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max">Max Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={editedComponent.properties.max || 100}
                  onChange={(e) =>
                    updateProperty("max", parseInt(e.target.value), "max")
                  }
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={editedComponent.required}
              onCheckedChange={(checked) => updateProperty("required", checked)}
            />
            <Label htmlFor="required">Required question</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentEditor;