"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  startOfToday,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  subMonths,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import { useState, useTransition } from "react";
import { CalendarIcon, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const getDateRange = (filter: string): [Date, Date] => {
  const now = new Date();
  switch (filter) {
    case "Today":
      return [startOfToday(), now];
    case "Yesterday":
      return [subDays(startOfToday(), 1), startOfToday()];
    case "This Week":
      return [startOfWeek(now, { weekStartsOn: 1 }), now];
    case "Last Week":
      return [
        startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      ];
    case "This Month":
      return [new Date(now.getFullYear(), now.getMonth(), 1), now];
    case "Last Month":
      return [
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
        new Date(now.getFullYear(), now.getMonth(), 0),
      ];
    case "This Year":
      return [startOfYear(now), now];
    case "Last Year":
      return [
        startOfYear(new Date(now.getFullYear() - 1, 0, 1)),
        endOfYear(new Date(now.getFullYear() - 1, 0, 1)),
      ];
    default:
      return [new Date("2000-01-01"), now];
  }
};

const options = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
  "Last Year",
  "All Time",
  "Custom Range",
];

const DateFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [customRange, setCustomRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: subDays(new Date(), 10), to: new Date() });

  const [selectedOption, setSelectedOption] = useState<string>("All Time");
  const [open, setOpen] = useState(false);

  const handleSetRange = (from: Date, to: Date) => {
    if (from.toISOString().split("T")[0] === to.toISOString().split("T")[0])
      return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from.toISOString());
    params.set("to", to.toISOString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });

    setCustomRange({ from, to });
    setSelectedOption("Custom Range");
    setOpen(false);
  };

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);

    if (value === "Custom Range") {
      setOpen(true);
      return;
    }

    const [from, to] = getDateRange(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from.toISOString());
    params.set("to", to.toISOString());

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });

    setCustomRange({ from: undefined, to: undefined });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={selectedOption} onValueChange={handleSelectChange}>
        <SelectTrigger className="text-left">
          <CalendarIcon
            className="text-muted-foreground mr-2"
            strokeWidth={1.5}
            size={18}
          />
          <SelectValue placeholder="This Month">{selectedOption}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show range separately beside select if custom range selected */}
      {selectedOption === "Custom Range" &&
        customRange?.from &&
        customRange?.to && (
          <div className="text-sm text-muted-foreground">
            {`${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`}
          </div>
        )}

      {/* Clear custom range */}
      {selectedOption === "Custom Range" && customRange.from && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedOption("This Month");
            const [from, to] = getDateRange("This Month");
            setCustomRange({ from: undefined, to: undefined });
            const params = new URLSearchParams(searchParams.toString());
            params.set("from", from.toISOString());
            params.set("to", to.toISOString());
            router.push(`?${params.toString()}`, { scroll: false });
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Calendar Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-auto p-4">
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={customRange.from}
            selected={customRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                handleSetRange(range.from, range.to);
              } else {
                setCustomRange({ from: range?.from, to: range?.to });
              }
              setOpen(true); // Keep modal open until complete range is selected
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DateFilter;
