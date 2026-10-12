import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/** Fades its children up, one after another, the first time they scroll into view. */
export function RevealGroup({ children, className }: RevealProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside a RevealGroup. */
export function RevealItem({ children, className }: RevealProps) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}
