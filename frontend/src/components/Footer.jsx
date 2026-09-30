import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 mt-24">
      <div className="container-page py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-teal-400 text-white">
              <HeartPulse size={18} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold text-white">
              Med<span className="text-teal-400">Chain</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-sm">
            A patient-owned healthcare platform. Your records stay
            blockchain-verified and consent-controlled — care from doctors
            you trust, without the paperwork.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/#services" className="hover:text-teal-400 transition-colors">
                Services
              </a>
            </li>
            <li>
              <a href="/#doctors" className="hover:text-teal-400 transition-colors">
                Our Doctors
              </a>
            </li>
            <li>
              <a href="/#why-us" className="hover:text-teal-400 transition-colors">
                Why MedChain
              </a>
            </li>
            <li>
              <Link to="/register" className="hover:text-teal-400 transition-colors">
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-teal-400" />
              <span>+91 120 456 7890</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-teal-400" />
              <span>care@medchain.health</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-400" />
              <span>Noida, Uttar Pradesh, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} MedChain. All rights reserved.</p>
          <p>Secured by blockchain-verified consent &amp; access control.</p>
        </div>
      </div>
    </footer>
  );
}
