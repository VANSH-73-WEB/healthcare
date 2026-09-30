import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A thin ECG-style heartbeat line used as MedChain's recurring visual signature.
 * Draws itself in on scroll, then keeps a faint idle pulse.
 */
export default function PulseLine({ className = "", color = "#12B8A6" }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 800 60"
        preserveAspectRatio="none"
        className="w-full h-10"
      >
        <motion.path
          d="M0 30 H260 L285 30 L300 8 L318 52 L335 30 L355 30 L370 16 L385 44 L400 30 H800"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
