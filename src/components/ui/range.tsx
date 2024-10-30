import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface RangeProps {
  className?: string;
  minValue: number;
  maxValue: number;
  step: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

const   Range = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeProps
>(({ 
  className, 
  minValue, 
  maxValue, 
  step, 
  value, 
  onValueChange,
  ...props 
}, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    min={minValue}
    max={maxValue}
    step={step}
    value={value}
    onValueChange={(newValue) => {
      onValueChange(newValue as [number, number]);
    }}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-slate-100">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-slate-900" />
    </SliderPrimitive.Track>
    {value.map((_, index) => (
      <SliderPrimitive.Thumb
        key={index}
        className="block h-4 w-4 rounded-full border border-slate-200 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100"
        aria-label={index === 0 ? 'Minimum price' : 'Maximum price'}
      >
    
      </SliderPrimitive.Thumb>
    ))}
  </SliderPrimitive.Root>
));

Range.displayName = 'Range';

export { Range };