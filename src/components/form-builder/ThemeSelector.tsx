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
import { cn } from "@/lib/utils";

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
  const handleRandomizeTheme = () => {
    function randomHue() {
      return Math.floor(Math.random() * 360);
    }
    function hsl(h: number, s: number, l: number) {
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    const hue = randomHue();
    const primaryColor = hsl(hue, 70, 50);
    const backgroundColor = hsl(hue, 40, 96);
    const textColor = "#fff";
    const randomTheme: FormTheme = {
      id: `random-${Date.now()}`,
      name: "Random",
      primaryColor,
      backgroundColor,
      textColor,
    };
    handleSelectTheme(randomTheme);
  };

  return (
    <div className={cn('h-fit overflow-y-auto',className)}>
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          {DEFAULT_FORM_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              className={`relative flex flex-col items-center justify-center h-20 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedTheme.id === theme.id
                  ? "border ring-2 ring-primary/30"
                  : "border-muted"
              }`}
              style={{
                backgroundColor: theme.primaryColor,
                color: "#fff",
              }}
              aria-label={`Select ${theme.name} theme`}
            >
              {/* Light black overlay for better text contrast */}
              <span className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none" />
              <span className="absolute top-2 right-2 z-10">
                {selectedTheme.id === theme.id && (
                  <Check className="w-4 h-4 text-white drop-shadow" />
                )}
              </span>
              <Palette className="w-6 h-6 mb-1 z-10" />
              <span className="font-semibold text-center text-xs pointer-events-none z-10">
                {theme.name}
              </span>
            </button>
          ))}
          <div className="col-span-2">
            <Button
              type="button"
              className="flex flex-col items-center justify-center h-20 w-full"
              // style={{ color: "#fff", backgroundColor: "#222" }}
              onClick={handleRandomizeTheme}
            >
              <Palette />
              <span className="text-xs">Randomize</span>
            </Button>
          </div>
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
          {/* <div className="space-y-2">
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
            </div> */}
          {/* <div className="space-y-2">
              <Label htmlFor="border-radius">Border Radius</Label>
              <Input
                id="border-radius"
                value={customTheme.borderRadius}
                onChange={(e) => handleChange(borderRadius", e.target.value)}
              />
            </div> */}
          <Button onClick={handleCustomizeTheme} className="w-full">
            Apply Theme
          </Button>
        </div>
      </div>
    </div>
  );
};
