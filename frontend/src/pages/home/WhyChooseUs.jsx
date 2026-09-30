import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "../../components/SectionHeading.jsx";

const POINTS = [
  "Blockchain-verified consent for every record access",
  "Credential-checked doctors across 20+ specialties",
  "End-to-end encrypted video consultations",
  "Records that travel with you between hospitals",
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="container-page py-24 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-teal-50 to-brand-50 -z-10" />
          <img
            src="https://images.unsplash.com/photo-1758691461932-d0aa0ebf6b31?fm=jpg&q=70&w=1000&auto=format&fit=crop"
            alt="Doctor consulting a patient remotely over video call"
            className="w-full h-[380px] sm:h-[440px] rounded-2xl object-cover shadow-card"
            loading="lazy"
          />
        </motion.div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Why MedChain"
            title="Care built around trust, not paperwork"
            description="Traditional healthcare systems lock your data in silos. MedChain puts control back in your hands, without sacrificing clinical quality."
          />

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4 -mt-6"
          >
            {POINTS.map((point) => (
              <motion.li
                key={point}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.45 } },
                }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-500" />
                <span className="text-body">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
