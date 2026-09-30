import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Doctors", href: "/#doctors" },
  { label: "Why MedChain", href: "/#why-us" },
  { label: "Testimonials", href: "/#testimonials" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/login");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md shadow-soft"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <nav className="container-page flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 text-white shadow-card">
            <HeartPulse size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold text-ink tracking-tight">
            Med<span className="text-brand-500">Chain</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-body hover:text-brand-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === "patient" ? "/patient" : "/doctor"}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-brand-600 transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <span className="hidden lg:inline text-sm text-body/70 capitalize">
                {user.name} &middot; {user.role}
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2.5 text-sm">
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-body hover:text-brand-600 transition-colors"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Book Appointment
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-ink/5 bg-white"
          >
            <div className="container-page py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-body hover:text-brand-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-ink/5 my-1" />
              {user ? (
                <>
                  <Link
                    to={user.role === "patient" ? "/patient" : "/doctor"}
                    className="text-sm font-semibold text-body"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary w-full text-sm"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-body">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary w-full text-sm">
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
