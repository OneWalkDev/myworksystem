"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";

interface DatePickerProps {
  id: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function DatePicker({
  id,
  name,
  defaultValue,
  placeholder,
  className = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm",
  required = false,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);

  useEffect(() => {
    // CSSを動的にロード
    if (typeof document !== "undefined" && !document.getElementById("flatpickr-css")) {
      const link = document.createElement("link");
      link.id = "flatpickr-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
      document.head.appendChild(link);
    }

    if (inputRef.current && !fpRef.current) {
      fpRef.current = flatpickr(inputRef.current, {
        dateFormat: "Y-m-d",
        locale: {
          firstDayOfWeek: 0,
          weekdays: {
            shorthand: ["日", "月", "火", "水", "木", "金", "土"],
            longhand: [
              "日曜日",
              "月曜日",
              "火曜日",
              "水曜日",
              "木曜日",
              "金曜日",
              "土曜日",
            ],
          },
          months: {
            shorthand: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            longhand: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
          },
        },
      });

      if (defaultValue) {
        fpRef.current.setDate(defaultValue);
      }
    }

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
        fpRef.current = null;
      }
    };
  }, [defaultValue]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
}
