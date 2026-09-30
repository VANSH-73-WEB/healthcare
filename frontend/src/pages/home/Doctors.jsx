import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import SectionHeading from "../../components/SectionHeading.jsx";

const DOCTORS = [
  {
    name: "Dr. Arjun Mehta",
    role: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1758691463582-11aea602cd4a?fm=jpg&q=70&w=600&auto=format&fit=crop",
    rating: "4.9",
  },
  {
    name: "Dr. Kavya Sharma",
    role: "General Physician",
    image:
      "https://images.unsplash.com/photo-1758691462651-611d730c5272?fm=jpg&q=70&w=600&auto=format&fit=crop",
    rating: "4.8",
  },
  {
    name: "Dr. Rohan Verma",
    role: "Orthopedic Surgeon",
    image:
      "https://images.unsplash.com/photo-1758691463333-c79215e8bc3b?fm=jpg&q=70&w=600&auto=format&fit=crop",
    rating: "5.0",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Doctors() {
  return (
    <section id="doctors" className="bg-white scroll-mt-24">
      <div className="container-page py-24">
        <SectionHeading
          eyebrow="Our specialists"
          title="Meet a few of the doctors on MedChain"
          description="Every specialist is credential-verified before they can accept a single patient."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {DOCTORS.map((doc) => (
            <motion.div
              key={doc.name}
              variants={item}
              whileHover={{ y: -8 }}
              className="group card-surface overflow-hidden transition-shadow duration-300 hover:shadow-card"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-soft">
                  <Star size={12} className="text-amber-500" fill="currentColor" strokeWidth={0} />
                  {doc.rating}
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-ink">{doc.name}</h3>
                  <p className="text-sm text-teal-600">{doc.role}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-body/50 transition-all group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/register" className="btn-secondary">
            View all specialists
          </Link>
        </div>
      </div>
    </section>
  );
}
