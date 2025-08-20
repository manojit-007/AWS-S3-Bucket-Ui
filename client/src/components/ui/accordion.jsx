import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}) {
  return (
    (<AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props} />)
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return (
    (<AccordionPrimitive.Header className="flex w-full pr-[2px]">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 group flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <span className="-ml-2 flex items-center justify-center hover:text-black">
          {/* Down when closed */}
          <ChevronDownIcon className="h-[34px] p-1 w-10 btn-shadow border-none rounded-none transition-transform duration-200 group-data-[state=open]:hidden" />
          {/* Up when open */}
          <ChevronUpIcon className="h-[34px] p-1 w-10 transition-transform duration-200 rounded-none hidden group-data-[state=open]:block btn-shadow border-none" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>)
  );
}

function AccordionContent({
  className,
  children,
  ...props
}) {
  return (
    (<AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>)
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
