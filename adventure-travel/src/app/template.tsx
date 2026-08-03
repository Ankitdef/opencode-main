"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * App Router template re-mounts on every navigation, so this gives each route a
 * smooth cross-fade entrance. We animate OPACITY ONLY (never transform/filter):
 * a transformed ancestor would become the containing block for `position: fixed`
 * descendants (scroll-progress bar, popups, mobile menu), silently breaking them.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
