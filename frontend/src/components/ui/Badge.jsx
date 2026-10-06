import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-stone-900 text-stone-50 hover:bg-stone-900/80",
    primary: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80",
    secondary: "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-100/80",
    destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200/80",
    outline: "text-stone-950",
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
