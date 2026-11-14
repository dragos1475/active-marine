import { motion, type HTMLMotionProps } from "motion/react";

/** Brings a block in as it scrolls into view. Kept short and blur-free so text is readable at once. */
export function Reveal({ delay = 0, y = 14, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.12), ease: [0.16, 1, 0.3, 1] }}
      {...props}
    />
  );
}

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden="true">
      <path d="M25.5 4 47 42H36L25.5 22 15.5 42H5Z" className="fill-primary" />
      <path d="M8 43c10-8 18-8 28-2 4 2 8 3 12 1" className="stroke-foreground" strokeWidth="4" fill="none" />
    </svg>
  );
}
