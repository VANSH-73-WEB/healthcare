import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  FileClock,
  Video,
  CalendarCheck,
  Headphones,
} from "lucide-react";
import SectionHeading from "../../components/SectionHeading.jsx";

const SERVICES = [
  {
    icon: ShieldCheck,
    title: "Patient-Owned Records",
    desc: "You decide who can view or add to your medical history — enforced by smart contracts, not paperwork.",
  },
  {
    icon: Database,
    title: "Tamper-Proof Storage",
    desc: "Files live on IPFS; their cryptographic fingerprint is anchored on the Ethereum blockchain.",
  },
  {
    icon: FileClock,
    title: "Full Audit Trail",
    desc: "Every access, grant, or revoke is permanently and transparently logged on-chain.",
  },
  {
    icon: Video,
    title: "Video Consultations",
    desc: "Meet your doctor face-to-face from home with secure, encrypted video visits.",
  },
  {
    icon: CalendarCheck,
    title: "Smart Scheduling",
    desc: "Real-time doctor availability with instant confirmations and reminders.",
  },
  {
    icon: Headphones,
    title: "24/7 Care Support",
    desc: "A dedicated care team is always reachable for urgent questions and follow-ups.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section id="services" className="container-page py-24 scroll-mt-24">
      <SectionHeading
        eyebrow="What we offer"
        title="Everything your care team needs, in one secure platform"
        description="From booking to records to consent management — built around how care actually happens."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {SERVICES.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={{ y: -6 }}
            className="card-surface p-7 transition-shadow duration-300 hover:shadow-card"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-teal-50 text-brand-600">
              <Icon size={20} strokeWidth={2.2} />
            </span>
            <h3 className="mt-5 font-display font-semibold text-ink text-lg">
              {title}
            </h3>
            <p className="mt-2 text-sm text-body leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
