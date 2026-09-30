import React from "react";
import { motion } from "framer-motion";
import { Siren, PhoneCall } from "lucide-react";

export default function EmergencyCare() {
  return (
    <section id="contact" className="container-page pb-24 pt-4 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-alert-500/20 bg-alert-500/5 px-7 py-6 sm:px-9"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <span className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-alert-500/10 text-alert-500">
            <Siren size={22} />
          </span>
          <div>
            <h3 className="font-display font-semibold text-ink">
              Medical emergency? Don&apos;t wait for a portal.
            </h3>
            <p className="text-sm text-body mt-1">
              Our emergency line connects you to a triage nurse in under 60 seconds, 24/7.
            </p>
          </div>
        </div>
        <a href="tel:+911204567890" className="btn-emergency shrink-0">
          <PhoneCall size={16} /> Call Emergency: +91 120 456 7890
        </a>
      </motion.div>
    </section>
  );
}
