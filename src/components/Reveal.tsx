import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-1000 ease-out will-change-transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
