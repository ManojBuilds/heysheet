"use client";

import countries from "world-countries";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getUserLocationInfo } from "@/actions";
import { FormTheme } from "@/types/form-builder";
import { cn } from "@/lib/utils";

const formattedCountries = countries.map((country) => ({
  name: country.name.common,
  code: country.cca2,
  dialCode: `+${country.idd.root?.replace("+", "") || ""}${country.idd.suffixes?.[0] || ""}`,
  flag: String.fromCodePoint(
    ...[...country.cca2.toUpperCase()].map(
      (char) => 127397 + char.charCodeAt(0),
    ),
  ),
}));

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  theme: FormTheme;
}

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  disabled,
  theme,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(formattedCountries[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function detectUserCountry() {
      try {
        const data = await getUserLocationInfo();
        const country = formattedCountries.find((c) => c.code === data.country);
        if (country) {
          setSelectedCountry(country);
          if (!value) {
            onChange(country.dialCode);
          }
        }
      } catch (error) {
        console.error("Geolocation error:", error);
      }
    }

    detectUserCountry();
  }, [value, onChange]);

  const localNumber = value.startsWith(selectedCountry.dialCode)
    ? value.slice(selectedCountry.dialCode.length)
    : value;

  return (
    <div className="flex items-center gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-28 justify-start")}
            style={{ backgroundColor: theme.backgroundSecondary }}
            disabled={disabled}
          >
            <span className="mr-1">{selectedCountry.flag}</span>
            {selectedCountry.dialCode}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-64">
          <Command
            className="backdrop-blur-2xl opacity-80"
            style={{ backgroundColor: theme.backgroundSecondary }}
          >
            <CommandInput placeholder="Search country…" />
            <CommandList className="max-h-60 overflow-auto">
              {formattedCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => {
                    const oldDialCode = selectedCountry.dialCode;
                    const currentLocalNumber = value.startsWith(oldDialCode)
                      ? value.slice(oldDialCode.length)
                      : value;

                    setSelectedCountry(country);
                    onChange(country.dialCode + currentLocalNumber);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-muted-foreground">
                    {country.dialCode}
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        type="tel"
        placeholder="Enter phone number"
        value={localNumber}
        onChange={(e) => {
          const rawInput = e.target.value;
          onChange(selectedCountry.dialCode + rawInput);
        }}
        onBlur={onBlur}
        className="flex-1"
        disabled={disabled}
        style={{ backgroundColor: theme.backgroundSecondary }}
      />
    </div>
  );
}
