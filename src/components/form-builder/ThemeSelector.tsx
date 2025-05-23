import React, { useState } from "react";
import { Check, Palette } from "lucide-react";
import { FormTheme } from "@/types/form-builder";
import { DEFAULT_FORM_THEMES } from "@/lib/form-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    const secondaryColor = hsl(hue, 60, 60);
    const accentColor = hsl((hue + 120) % 360, 70, 50);
    const backgroundColor = hsl(hue, 10, 98);
    const backgroundSecondary = hsl(hue, 15, 95);
    const textColor = hsl(hue, 15, 15);
    const textColorSecondary = hsl(hue, 10, 30);
    const borderColor = hsl(hue, 15, 90);
    const errorColor = "#DC2626";

    const randomTheme: FormTheme = {
      id: `random-${Date.now()}`,
      name: "Random",
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      backgroundSecondary,
      textColor,
      textColorSecondary,
      borderColor,
      errorColor,
    };
    handleSelectTheme(randomTheme);
  };

  return (
    <div className={cn('h-[calc(100svh-9rem)] overflow-y-auto',className)}>
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          {DEFAULT_FORM_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              className={`relative flex flex-col items-center justify-center h-24 rounded-lg border-2 transition-colors cursor-pointer ${
                selectedTheme.id === theme.id
                  ? "border ring-2 ring-primary/30"
                  : "border-muted"
              }`}
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
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

          {/* Primary Colors Section */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-muted-foreground">Primary Colors</h5>
            <ColorInput
              label="Primary Color"
              value={customTheme.primaryColor}
              onChange={(value) => handleChange("primaryColor", value)}
            />
            <ColorInput
              label="Secondary Color"
              value={customTheme.secondaryColor}
              onChange={(value) => handleChange("secondaryColor", value)}
            />
            <ColorInput
              label="Accent Color"
              value={customTheme.accentColor}
              onChange={(value) => handleChange("accentColor", value)}
            />
          </div>

          {/* Background Colors Section */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-muted-foreground">Background Colors</h5>
            <ColorInput
              label="Background"
              value={customTheme.backgroundColor}
              onChange={(value) => handleChange("backgroundColor", value)}
            />
            <ColorInput
              label="Background Secondary"
              value={customTheme.backgroundSecondary}
              onChange={(value) => handleChange("backgroundSecondary", value)}
            />
          </div>

          {/* Text Colors Section */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-muted-foreground">Text Colors</h5>
            <ColorInput
              label="Text Color"
              value={customTheme.textColor}
              onChange={(value) => handleChange("textColor", value)}
            />
            <ColorInput
              label="Text Color Secondary"
              value={customTheme.textColorSecondary}
              onChange={(value) => handleChange("textColorSecondary", value)}
            />
          </div>

          {/* Other Colors Section */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-muted-foreground">Other Colors</h5>
            <ColorInput
              label="Border Color"
              value={customTheme.borderColor}
              onChange={(value) => handleChange("borderColor", value)}
            />
            <ColorInput
              label="Error Color"
              value={customTheme.errorColor}
              onChange={(value) => handleChange("errorColor", value)}
            />
          </div>

          <Button onClick={handleCustomizeTheme} className="w-full">
            Apply Theme
          </Button>
        </div>
      </div>
    </div>
  );
};

// Add this new ColorInput component at the end of the file
interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
      <div className="flex gap-2">
        <div
          className="w-8 h-8 border rounded"
          style={{ backgroundColor: value }}
        />
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};
