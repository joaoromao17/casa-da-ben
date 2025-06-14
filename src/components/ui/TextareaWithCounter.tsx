import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaWithCounterProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength: number;
}

const TextareaWithCounter = React.forwardRef<HTMLTextAreaElement, TextareaWithCounterProps>(
  (
    {
      className,
      maxLength,
      onChange,
      onBlur,
      name,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [currentLength, setCurrentLength] = React.useState(() => {
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      onChange?.(e); // repassa o evento para o RHF
    };

    return (
      <div className="space-y-2">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          name={name}
          onChange={handleChange}
          onBlur={onBlur}
          maxLength={maxLength}
          defaultValue={defaultValue}
          {...props}
        />
        <div className="flex justify-end">
          <span
            className={cn(
              "text-sm text-gray-500",
              currentLength > maxLength * 0.9 && "text-orange-500",
              currentLength === maxLength && "text-red-500"
            )}
          >
            {currentLength}/{maxLength} caracteres
          </span>
        </div>
      </div>
    );
  }
);

TextareaWithCounter.displayName = "TextareaWithCounter";

export { TextareaWithCounter };
