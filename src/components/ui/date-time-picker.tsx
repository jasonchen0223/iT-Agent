"use client";

import * as React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * 日期时间选择器组件
 * 
 * 允许用户选择日期和时间
 * 
 * @param {DateTimePickerProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function DateTimePicker({
  date,
  setDate,
  disabled,
  className,
  placeholder = "选择日期和时间",
}: DateTimePickerProps) {
  const minuteRef = React.useRef<HTMLButtonElement>(null);
  const hourRef = React.useRef<HTMLButtonElement>(null);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  // 当传入的日期变化时更新内部状态
  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // 当日期变化时更新父组件状态
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDate(date);
    }
  };

  // 小时变化处理
  const handleHourChange = (hour: string) => {
    if (!selectedDate || !hour) return;

    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(hour));
    handleSelect(newDate);

    // 选择小时后自动聚焦到分钟选择
    if (minuteRef.current) {
      minuteRef.current.focus();
    }
  };

  // 分钟变化处理
  const handleMinuteChange = (minute: string) => {
    if (!selectedDate || !minute) return;

    const newDate = new Date(selectedDate);
    newDate.setMinutes(parseInt(minute));
    handleSelect(newDate);
  };

  return (
    <Popover open={isVisible} onOpenChange={setIsVisible}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-indigo-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p", { locale: zhCN }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
        <div className="border-t border-indigo-700/30 p-3">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <span className="text-xs text-indigo-300">时间</span>
              <div className="flex items-center space-x-2">
                {/* 小时选择 */}
                <Select
                  value={selectedDate?.getHours().toString().padStart(2, "0")}
                  onValueChange={handleHourChange}
                  disabled={!selectedDate}
                >
                  <SelectTrigger ref={hourRef} className="w-16">
                    <SelectValue placeholder="时" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-indigo-300">:</span>
                {/* 分钟选择 */}
                <Select
                  value={selectedDate?.getMinutes().toString().padStart(2, "0")}
                  onValueChange={handleMinuteChange}
                  disabled={!selectedDate}
                >
                  <SelectTrigger ref={minuteRef} className="w-16">
                    <SelectValue placeholder="分" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SelectItem
                        key={i * 5}
                        value={(i * 5).toString().padStart(2, "0")}
                      >
                        {(i * 5).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Clock className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <div className="flex">
              <Button
                size="sm"
                variant="outline"
                disabled={!selectedDate}
                onClick={() => setIsVisible(false)}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 