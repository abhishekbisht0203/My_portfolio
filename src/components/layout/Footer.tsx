"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from "lucide-react";
import { siteConfig } from "@/constants";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.05]" role="contentinfo">
      {/* Gradient divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white text-xs">
                AB
              </div>
              <span className="font-heading font-semibold text-lg">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Building exceptional digital experiences with modern technologies.
              Always learning, always shipping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About", "Projects", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={link === "Blog" ? "/blog" : `#${link.toLowerCase()}`}
                    className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              {siteConfig.links.map((link) => {
                const Icon = socialIcons[link.icon];
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg glass text-slate-400 hover:text-white transition-colors duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.name}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 flex items-center gap-1">
            © {new Date().getFullYear()} {siteConfig.name}. Built with
            <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" />
            using Next.js
          </p>

          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
