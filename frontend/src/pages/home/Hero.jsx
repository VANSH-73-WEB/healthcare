import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import PulseLine from "../../components/PulseLine.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-radial-fade">
      <div className="container-page pt-14 pb-20 md:pt-20 md:pb-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="eyebrow mb-5">
              <Sparkles size={14} /> Patient-owned &amp; blockchain-secured
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-ink leading-[1.08] tracking-tight"
          >
            Healthcare that puts{" "}
            <span className="bg-gradient-to-r from-brand-500 to-teal-500 bg-clip-text text-transparent">
              you
            </span>{" "}
            in control.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 text-lg text-body leading-relaxed max-w-lg"
          >
            Book trusted doctors, manage your medical records, and decide
            exactly who can access them — enforced by smart contracts, not
            paperwork.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            {user ? (
              <Link
                to={user.role === "patient" ? "/patient" : "/doctor"}
                className="btn-primary"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Book an Appointment <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex items-center gap-6"
          >
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
              <span className="ml-2 text-sm font-semibold text-ink">4.9/5</span>
            </div>
            <span className="text-sm text-body">
              from 2,300+ verified patients
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-teal-50 to-transparent -z-10" />

          <div className="relative rounded-[2rem] overflow-hidden shadow-card border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1758691461957-474a7686e388?fm=jpg&q=70&w=1200&auto=format&fit=crop"
              alt="Doctor greeting a patient during a friendly consultation"
              className="w-full h-[420px] sm:h-[480px] object-cover"
              loading="eager"
            />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-8 card-surface px-4 py-3.5 flex items-center gap-3 max-w-[190px]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <ShieldCheck size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">On-chain consent</p>
              <p className="text-xs text-body">Every access logged</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute -right-4 bottom-10 card-surface px-4 py-3.5 max-w-[170px]"
          >
            <p className="text-2xl font-display font-bold text-brand-600">120+</p>
            <p className="text-xs text-body">Specialists ready to consult today</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="container-page pb-2">
        <PulseLine />
      </div>
    </section>
  );
}
