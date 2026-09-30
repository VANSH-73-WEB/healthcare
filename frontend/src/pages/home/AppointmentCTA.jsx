import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AppointmentCTA() {
  const { user } = useAuth();

  return (
    <section className="container-page py-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500 px-8 py-14 sm:px-16 sm:py-16 text-center"
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />

        <div className="relative">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
            Your next appointment is a few taps away
          </h2>
          <p className="mt-4 text-white/85 max-w-lg mx-auto">
            Join thousands of patients who manage their entire care journey —
            from booking to records — on one secure platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? (user.role === "patient" ? "/patient" : "/doctor") : "/register"}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 shadow-card transition-all hover:-translate-y-0.5"
            >
              {user ? "Go to Dashboard" : "Book Your Appointment"} <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+911204567890"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <PhoneCall size={16} /> Talk to Care Team
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
