"use client";
import React, { useEffect, useState } from "react";
import {
  Check,
  LightbulbIcon,
  Loader2,
  MoonIcon,
  Palette,
  SunIcon,
} from "lucide-react";
import { FormData, FormTheme } from "@/types/form-builder";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { generateTheme } from "@/lib/theme";
import { fetchGoogleFonts } from "@/actions";

interface ThemeSelectorProps {
  selectedTheme: FormTheme;
  onSelectTheme: (theme: FormTheme) => void;
  onCustomizeTheme: (theme: FormTheme) => void;
  className?: string;
  formData: FormData;
}

const presetColors = [
  "#607AFB",
  "#39E079",
  "#359EFF",
  "#EA2831",
  "#FAC638",
  "#019863",
  "#F4C753",
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
  onCustomizeTheme,
  className,
  formData,
}) => {
  const { user } = useUser();
  const supabase = createClient();
  const [theme, setTheme] = useState<"light" | "dark">(
    selectedTheme.mode || "dark",
  );
  const [color, setColor] = useState(selectedTheme.primary || "#3f30e8");
  const [radius, setRadius] = useState(selectedTheme.radius || "lg");
  const [font, setFont] = useState(selectedTheme.font || "Outfit");

  const { data: fonts, isLoading } = useQuery({
    queryKey: ["fonts"],
    queryFn: fetchGoogleFonts,
  });

  const applyThemeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !formData.id) return;
      const { data, error } = await supabase
        .from("forms")
        .update({
          builder_config: {
            pages: formData.pages,
            components: formData.components,
            active_page: formData.activePage,
            success_page: formData.successPage,
            theme: {
              mode: theme,
              color,
              radius,
              font,
            },
          },
        })
        .eq("id", formData.id)
        .eq("user_id", user?.id)
        .select();
      if (error) {
        throw error;
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const colorPallet = generateTheme(color, font, radius, theme);
    onSelectTheme(colorPallet);
  }, [color, font, radius, theme]);

  const handleApplyTheme = () => {
    const colorPallet = generateTheme(color, font, radius, theme);
    onSelectTheme(colorPallet);
    applyThemeMutation.mutate();
  };

  return (
    <div className={cn("w-[240px] p-4 space-y-4", className)}>
      {/* <div className="space-y-2">
        <Label className="block text-muted-foreground">Appearance</Label>
        <div className="flex items-center gap-2">
          <Button
            variant={theme === "light" ? "secondary" : "outline"}
            onClick={() => setTheme("light")}
            leftIcon={<SunIcon />}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            onClick={() => setTheme("dark")}
            leftIcon={<MoonIcon />}
          >
            Dark
          </Button>
        </div>
      </div> */}
      <div className="space-y-2">
        <Label className="block text-muted-foreground">Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <Button
              key={preset}
              onClick={() => setColor(preset)}
              className="flex items-center justify-center"
              variant={color === preset ? "secondary" : "outline"}
            >
              <div
                className={cn("h-6 aspect-square rounded")}
                style={{
                  backgroundColor: preset,
                  borderColor: preset === color ? "#000" : "#ccc",
                }}
              />
            </Button>
          ))}
        </div>
        <Label htmlFor="color">
          <div
            className={buttonVariants({
              variant: "outline",
              className: "flex items-center !justify-between gap-2 w-full",
            })}
          >
            <p className="text-muted-foreground">Custom</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              {color}
              <input
                type="color"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-4 h-4 rounded border-none outline-none"
              />
            </div>
          </div>
        </Label>
      </div>

      <div className="space-y-2">
        <Label className="block text-muted-foreground">Corner Radius</Label>
        <div className="flex gap-2">
          {["sm", "md", "lg", "xl"].map((r) => (
            <Button
              key={r}
              onClick={() => setRadius(r)}
              className="flex items-center justify-center"
              variant={radius === r ? "secondary" : "outline"}
            >
              <div
                className={cn("w-4 h-4 border-l-2 border-t-2 border-white/50", {
                  "rounded-tl-sm": r === "sm",
                  "rounded-tl-md": r === "md",
                  "rounded-tl-lg": r === "lg",
                  "rounded-tl-xs": r === "xs",
                  "rounded-tl-xl": r === "xl",
                  "rounded-tl-2xl": r === "2xl",
                })}
              />
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-2 w-full max-w-sm">
        <Label className="block text-muted-foreground">Font</Label>
        <Select onValueChange={setFont} value={font}>
          <SelectTrigger disabled={isLoading} className="w-full border">
            <SelectValue placeholder="Select font" className="w-full" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {fonts?.map((fontItem: { family: string }) => (
              <SelectItem key={fontItem.family} value={fontItem.family}>
                {fontItem.family}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full mt-2"
        disabled={applyThemeMutation.isPending}
        leftIcon={
          applyThemeMutation.isPending && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )
        }
        onClick={handleApplyTheme}
      >
        Apply theme
      </Button>
    </div>
  );
};
