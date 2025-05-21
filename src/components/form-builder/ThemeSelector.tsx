import React, { useState } from "react";
import { Check, Plus, ChevronDown, Edit, Palette } from "lucide-react";
import { FormTheme } from "@/types/form-builder";
import { DEFAULT_FORM_THEMES, FONT_FAMILIES } from "@/lib/form-builder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectorProps {
  selectedTheme: FormTheme;
  onSelectTheme: (theme: FormTheme) => void;
  onCustomizeTheme: (theme: FormTheme) => void;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
  onCustomizeTheme,
  className,
}) => {
  const [customTheme, setCustomTheme] = useState<FormTheme>({
    ...selectedTheme,
  });
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSelectTheme = (theme: FormTheme) => {
    onSelectTheme(theme);
    setCustomTheme({ ...theme });
  };

  const handleCustomizeTheme = () => {
    onCustomizeTheme(customTheme);
    setIsCustomizing(false);
  };

  const handleChange = (field: keyof FormTheme, value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Theme</h3>
          <div className="flex flex-wrap items-center gap-2">
            {DEFAULT_FORM_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedTheme.id === theme.id
                    ? "border-primary"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: theme.primaryColor }}
                aria-label={`Select ${theme.name} theme`}
              >
                {selectedTheme.id === theme.id && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>
            ))}
            <Button
            >
              <Palette className="w-3 h-3" />
              Randomize
            </Button>
          </div>
          <div className="space-y-4 mt-6">
            <h4 className="font-medium">Customize Theme</h4>
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: customTheme.primaryColor }}
                />
                <Input
                  id="primary-color"
                  value={customTheme.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: customTheme.backgroundColor }}
                />
                <Input
                  id="background-color"
                  value={customTheme.backgroundColor}
                  onChange={(e) =>
                    handleChange("backgroundColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 border rounded"
                  style={{ backgroundColor: customTheme.textColor }}
                />
                <Input
                  id="text-color"
                  value={customTheme.textColor}
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={customTheme.fontFamily}
                onValueChange={(value) => handleChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="border-radius">Border Radius</Label>
              <Input
                id="border-radius"
                value={customTheme.borderRadius}
                onChange={(e) => handleChange("borderRadius", e.target.value)}
              />
            </div>
            <Button onClick={handleCustomizeTheme} className="w-full">
              Apply Theme
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
