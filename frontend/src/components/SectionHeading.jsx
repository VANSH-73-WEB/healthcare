import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  const alignment =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <motion.div
      className={`flex flex-col ${alignment} gap-4 mb-14`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink max-w-2xl">
        {title}
      </h2>
      {description && (
        <p className="text-body text-base sm:text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
