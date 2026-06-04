"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, ExternalLink, Sparkles } from "lucide-react";
import { TypewriterEffect } from "@/components/animations/TypewriterEffect";
import { FloatingIcons } from "@/components/animations/FloatingIcons";
import { heroRoles, siteConfig } from "@/constants";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background Elements */}
      <FloatingIcons />

      {/* Radial gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.08), transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-slate-400">Available for new opportunities</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8 relative"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full animate-float">
              {/* Gradient ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 opacity-75 blur-sm animate-pulse-glow" />
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500" />
              <div className="relative w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* Placeholder avatar with initials */}
                <span className="text-3xl md:text-4xl font-heading font-bold gradient-text">
                  AB
                </span>
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="block text-white">
              {siteConfig.name.split(" ")[0]}
            </span>
            <span className="block gradient-text">
              {siteConfig.name.split(" ")[1]}
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            className="mb-6 text-xl sm:text-2xl md:text-3xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <TypewriterEffect words={heroRoles} className="font-heading" />
          </motion.div>

          {/* Description */}
          <motion.p
            className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            I craft exceptional digital experiences with modern technologies.
            Passionate about building products that are beautiful, performant,
            and solve real problems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.a
              href="#contact"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-4 w-4" />
              Hire Me
            </motion.a>

            <motion.a
              href="/resume/resume.pdf"
              download
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4" />
              Download Resume
            </motion.a>

            <motion.a
              href="#projects"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="h-4 w-4" />
              View Projects
            </motion.a>
          </motion.div>

          {/* Tech stack mini-bar */}
          <motion.div
            className="mt-16 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <span className="text-xs text-slate-600 uppercase tracking-wider">Tech Stack</span>
            <div className="w-8 h-px bg-slate-700" />
            <div className="flex items-center gap-2">
              {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="tech-badge text-[10px] py-1 px-2"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-slate-600 uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          className="scroll-indicator"
          aria-hidden="true"
        >
          <ArrowDown className="h-4 w-4 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
