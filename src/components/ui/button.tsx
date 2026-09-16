import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-semibold tracking-tight whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer active:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-b-4 border-primary/50 hover:bg-primary/95 active:border-b-0 active:translate-y-[3px] shadow-sm rounded-xl",
        outline: "border-2 border-border/80 border-b-4 border-b-border/90 bg-background text-foreground hover:bg-secondary/40 active:border-b-2 active:translate-y-[2px] rounded-xl shadow-xs",
        secondary: "bg-secondary text-secondary-foreground border-b-4 border-border/70 hover:bg-secondary/80 active:border-b-0 active:translate-y-[3px] rounded-xl",
        ghost: "hover:bg-secondary/60 hover:text-foreground text-muted-foreground rounded-xl active:translate-y-0",
        destructive: "bg-destructive text-destructive-foreground border-b-4 border-destructive/50 hover:bg-destructive/90 active:border-b-0 active:translate-y-[3px] shadow-sm rounded-xl",
        link: "text-primary underline-offset-4 hover:underline active:translate-y-0 font-medium",
      },
      size: {
        default: "h-10 px-5 py-2 text-xs",
        xs: "h-7 rounded-lg px-2.5 text-[11px] [&_svg:not([class*='size-'])]:size-3 border-b-2",
        sm: "h-8 rounded-lg px-3.5 text-xs [&_svg:not([class*='size-'])]:size-3.5 border-b-2",
        lg: "h-12 rounded-2xl px-6 text-sm border-b-4",
        xl: "h-14 rounded-2xl px-8 text-base border-b-4",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
