"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { experiences } from "@/data/portfolio";
import { formatDate } from "@/lib/utils";

function TimelineCard({
  experience,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex flex-col md:flex-row items-center gap-8 mb-12 last:mb-0 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-[1.4rem] md:left-1/2 md:-translate-x-1/2 z-10">
        <motion.div
          className="w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          viewport={{ once: true }}
        />
      </div>

      {/* Content */}
      <div className={`w-full md:w-[calc(50%-2rem)] ${isEven ? "md:pr-0" : "md:pl-0"}`}>
        <ScrollReveal direction={isEven ? "left" : "right"} delay={0.1}>
          <motion.div
            className="relative ml-12 md:ml-0 p-6 rounded-2xl glass card-hover group"
            whileHover={{ scale: 1.01 }}
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent rounded-t-2xl" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">
                  {experience.role}
                </h3>
                <p className="text-indigo-400 font-medium text-sm">
                  {experience.company}
                </p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {experience.type}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(experience.startDate)} —{" "}
                {experience.endDate === "Present"
                  ? "Present"
                  : formatDate(experience.endDate)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {experience.location}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {experience.description}
            </p>

            {/* Achievements */}
            <ul className="space-y-2 mb-4">
              {experience.achievements.slice(0, 3).map((achievement, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  {achievement}
                </li>
              ))}
            </ul>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span key={tech} className="tech-badge text-[10px]">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="relative section-padding" aria-label="Experience">
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,1), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4 block">
            Career Journey
          </span>
          <h2 className="section-heading mb-6">
            Work
            <span className="gradient-text"> Experience</span>
          </h2>
          <p className="section-subheading mx-auto">
            A timeline of my professional journey, building products and solving
            problems at scale.
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="timeline-line" aria-hidden="true" />

          {/* Cards */}
          {experiences.map((exp, index) => (
            <TimelineCard key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
