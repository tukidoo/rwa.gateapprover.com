"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: Date | string;
  onChange?: (date: Date | null, formattedString: string) => void;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Convert initial value to display string
    const getDisplayValue = (val: Date | string | undefined): string => {
      if (!val) return "";
      if (val instanceof Date) {
        const day = val.getDate().toString().padStart(2, "0");
        const month = (val.getMonth() + 1).toString().padStart(2, "0");
        const year = val.getFullYear().toString();
        return `${day}/${month}/${year}`;
      }
      return val;
    };

    const [displayValue, setDisplayValue] = React.useState(
      getDisplayValue(value)
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Format the input value with forward slashes
    const formatDateInput = (
      input: string,
      cursorPos?: number
    ): { formatted: string; newCursorPos: number } => {
      // Remove all non-numeric characters but keep track of cursor position
      const numbers = input.replace(/\D/g, "");
      let newCursorPos = cursorPos || 0;

      // Apply DD/MM/YYYY formatting
      let formatted = "";
      if (numbers.length <= 2) {
        formatted = numbers;
      } else if (numbers.length <= 4) {
        formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      } else {
        formatted = `${numbers.slice(0, 2)}/${numbers.slice(
          2,
          4
        )}/${numbers.slice(4, 8)}`;
      }

      // Adjust cursor position for added slashes
      if (cursorPos !== undefined) {
        const originalInput = input;
        const slashesBeforeCursor = (
          originalInput.slice(0, cursorPos).match(/\//g) || []
        ).length;
        const numbersBeforeCursor = originalInput
          .slice(0, cursorPos)
          .replace(/\D/g, "").length;

        // Calculate new cursor position
        if (numbersBeforeCursor <= 2) {
          newCursorPos = numbersBeforeCursor;
        } else if (numbersBeforeCursor <= 4) {
          newCursorPos = numbersBeforeCursor + 1; // +1 for first slash
        } else {
          newCursorPos = numbersBeforeCursor + 2; // +2 for both slashes
        }
      }

      return { formatted, newCursorPos };
    };

    // Parse DD/MM/YYYY string to Date object
    const parseDate = (dateString: string): Date | null => {
      if (!dateString || dateString.length !== 10) return null;

      const parts = dateString.split("/");
      if (parts.length !== 3) return null;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Basic validation
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
        return null;
      }

      // Create date (month is 0-indexed in JavaScript Date)
      const date = new Date(year, month - 1, day);

      // Verify the date is valid (handles cases like 31/02/2024)
      if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
      ) {
        return null;
      }

      return date;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cursorPos = e.target.selectionStart || 0;

      const { formatted, newCursorPos } = formatDateInput(
        inputValue,
        cursorPos
      );

      setDisplayValue(formatted);

      // Parse the formatted string to Date and call onChange
      const parsedDate = parseDate(formatted);
      onChange?.(parsedDate, formatted);

      // Set cursor position after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    };

    // Update display value when prop value changes
    React.useEffect(() => {
      setDisplayValue(getDisplayValue(value));
    }, [value]);

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        placeholder="DD/MM/YYYY"
        value={displayValue}
        onChange={handleInputChange}
        maxLength={10}
        ref={inputRef}
        {...props}
      />
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
