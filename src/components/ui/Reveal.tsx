import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function Reveal({
  children, delay = 0, y = 28, x = 0, className = '',
}: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
