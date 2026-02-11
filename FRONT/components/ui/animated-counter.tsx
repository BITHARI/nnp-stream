import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1000,
  formatValue = (val) => val.toString(),
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef(value);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (previousValueRef.current === value) {
      return;
    }

    setIsAnimating(true);
    const startValue = previousValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        previousValueRef.current = value;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-200 ${isAnimating ? "text-nnp-highlight scale-105" : ""} ${className}`}
    >
      {formatValue(displayValue)}
    </span>
  );
}
