import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "../../components/SectionHeading.jsx";

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    role: "Patient, Delhi NCR",
    quote:
      "I finally have one place for every prescription and lab report. Sharing my history with a new doctor takes seconds, not phone calls.",
    color: "0B63F6",
  },
  {
    name: "Rahul Kapoor",
    role: "Patient, Bengaluru",
    quote:
      "Booking a cardiologist used to mean a week of waiting. On MedChain I had a video consult the same evening.",
    color: "12B8A6",
  },
  {
    name: "Dr. Sana Iyer",
    role: "General Physician",
    quote:
      "The consent logs give me confidence I'm only ever looking at records patients have actually approved — it's a cleaner way to practice.",
    color: "0850C9",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white scroll-mt-24">
      <div className="container-page py-24">
        <SectionHeading
          eyebrow="Patients &amp; doctors alike"
          title="Trusted by the people who use it every day"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={item}
              whileHover={{ y: -6 }}
              className="card-surface p-7 flex flex-col"
            >
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="text-body text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    t.name
                  )}&background=${t.color}&color=fff&bold=true`}
                  alt=""
                  className="h-10 w-10 rounded-full"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-body">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
