import React from "react";
import { motion } from "framer-motion";

const STATS = [
  { value: "120+", label: "Verified specialists" },
  { value: "45k", label: "Records securely stored" },
  { value: "2,300+", label: "Patients onboarded" },
  { value: "99.9%", label: "Platform uptime" },
];

export default function Stats() {
  return (
    <section className="border-y border-ink/5 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="text-center md:text-left"
            >
              <p className="font-display text-3xl sm:text-4xl font-bold text-ink">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
