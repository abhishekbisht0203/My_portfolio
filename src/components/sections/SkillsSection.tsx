"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/ScrollReveal";
import { skills } from "@/data/portfolio";
import type { SkillCategory } from "@/types";

const categories: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud & DevOps",
  "AI & Tools",
];

function SkillCard({
  name,
  level,
  color,
}: {
  name: string;
  level: number;
  color?: string;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="group relative p-4 rounded-xl glass card-hover"
      whileHover={{ scale: 1.02 }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color || "#6366f1"}10, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: `${color || "#6366f1"}15`,
                color: color || "#6366f1",
              }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <span className="font-medium text-sm text-white">{name}</span>
          </div>
          <span className="text-xs font-mono text-slate-500">{level}%</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            style={{
              background: `linear-gradient(90deg, ${color || "#6366f1"}, ${color || "#6366f1"}80)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("Frontend");

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );

  return (
    <section id="skills" className="relative section-padding" aria-label="Skills">
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4 block">
            Skills & Expertise
          </span>
          <h2 className="section-heading mb-6">
            Technologies I
            <span className="gradient-text"> Work With</span>
          </h2>
          <p className="section-subheading mx-auto">
            A comprehensive toolkit spanning frontend, backend, cloud, and AI
            technologies — always expanding.
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeCategory === category
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeSkillTab"
                  className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </ScrollReveal>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <StaggerContainer
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            staggerDelay={0.08}
          >
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.name}
                name={skill.name}
                level={skill.level}
                color={skill.color}
              />
            ))}
          </StaggerContainer>
        </AnimatePresence>
      </div>
    </section>
  );
}
