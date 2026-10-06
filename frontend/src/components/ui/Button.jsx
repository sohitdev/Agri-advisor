import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md active:scale-[0.98] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
    outline: "border border-stone-200 bg-white hover:bg-stone-100 text-stone-900",
    ghost: "hover:bg-stone-100 hover:text-stone-900 text-stone-600",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 py-2",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
