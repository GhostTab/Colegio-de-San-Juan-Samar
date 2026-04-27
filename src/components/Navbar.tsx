import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Volume2, VolumeX, Compass } from "lucide-react";
import { getProgress, updateProgress } from "@/lib/progressStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const progress = getProgress();
  const [soundOn, setSoundOn] = useState(progress.soundEnabled);
  const lessonHubLink = progress.grade ? `/subjects?grade=${progress.grade}` : "/grades";
  const latestSubject = Object.entries(progress.lastAccessed)
    .sort((a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime())[0]?.[0];
  const resumeLink =
    progress.grade && latestSubject ? `/lessons?grade=${progress.grade}&subject=${latestSubject}` : lessonHubLink;

  const navLinks = [
    { to: "/", label: "Home", active: location.pathname === "/" },
    { to: "/dashboard", label: "Dashboard", active: location.pathname === "/dashboard" },
    {
      to: lessonHubLink,
      label: "Lessons",
      active: location.pathname === "/grades" || location.pathname === "/subjects" || location.pathname === "/lessons",
    },
    { to: "/quiz", label: "Activities", active: location.pathname === "/quiz" },
  ];

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    updateProgress({ soundEnabled: next });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/csjs-logo.png"
              alt="Colegio de San Juan Samar logo"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <span className="font-bold text-lg text-foreground hidden sm:block">
              CSJS <span className="text-primary">Learn</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.active;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-xl gradient-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={resumeLink}
              className="hidden md:inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <Compass className="h-3.5 w-3.5" />
              Resume
            </Link>
            <button
              onClick={toggleSound}
              className="rounded-xl p-2 transition-colors hover:bg-secondary"
              title={soundOn ? "Mute sounds" : "Enable sounds"}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
            </button>
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                to={resumeLink}
                onClick={() => setOpen(false)}
                className="mb-1 flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Compass className="h-4 w-4" />
                Resume Learning
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    link.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
