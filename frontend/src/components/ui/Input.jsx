import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-stone-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-[0.8rem] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
