"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-indigo-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-indigo-900/20 border border-indigo-700/30 text-indigo-200 hover:bg-indigo-800/30 hover:text-indigo-100 rounded-md flex items-center justify-center"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-indigo-300 rounded-md w-8 font-semibold text-xs m-0.5 text-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 m-0.5",
          props.mode === "range"
            ? "[&:has([aria-selected])]:bg-indigo-800/20 [&:has([aria-selected])]:rounded-md"
            : "[&:has([aria-selected].day-outside)]:bg-none"
        ),
        day: cn(
          "h-8 w-8 p-0 font-normal rounded-md aria-selected:opacity-100 hover:bg-indigo-700/30 text-indigo-200 hover:text-indigo-100 flex items-center justify-center"
        ),
        day_selected:
          "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white",
        day_today: "border border-indigo-500/60",
        day_outside:
          "day-outside text-indigo-400/50 aria-selected:bg-indigo-900/30 aria-selected:text-indigo-300 aria-selected:opacity-50",
        day_disabled: "text-indigo-500/40",
        day_range_middle:
          "aria-selected:bg-indigo-900/40 aria-selected:text-indigo-200",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
} 