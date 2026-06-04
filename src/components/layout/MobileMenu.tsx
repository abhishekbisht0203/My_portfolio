"use client";

import { motion } from "framer-motion";
import { navLinks, siteConfig } from "@/constants";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  activeSection: string;
  onClose: () => void;
}

export function MobileMenu({ activeSection, onClose }: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Menu Panel */}
      <motion.nav
        className="absolute inset-y-0 right-0 w-full max-w-sm glass-strong flex flex-col p-8 pt-24"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        aria-label="Mobile Navigation"
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const isActive =
              link.href.startsWith("#") &&
              activeSection === link.href.slice(1);
            return (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center px-4 py-3 rounded-xl text-lg font-medium transition-colors",
                  isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                )}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {link.label}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-8 pt-8 border-t border-white/[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#contact"
            onClick={onClose}
            className="btn-primary w-full justify-center"
          >
            Let&apos;s Talk
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="mt-auto flex items-center gap-4 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {siteConfig.links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors text-sm"
              aria-label={link.name}
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      </motion.nav>
    </motion.div>
  );
}
