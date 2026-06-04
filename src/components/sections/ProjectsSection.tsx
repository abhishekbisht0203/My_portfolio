"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, ChevronRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/ScrollReveal";
import { projects } from "@/data/portfolio";
import type { ProjectCategory, Project } from "@/types";

const filterCategories: ProjectCategory[] = [
  "All",
  "Web Apps",
  "Full Stack",
  "AI",
  "Open Source",
];

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="group relative rounded-2xl glass overflow-hidden card-hover cursor-pointer"
      onClick={() => onSelect(project)}
      whileHover={{ y: -4 }}
    >
      {/* Image placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Gradient overlay pattern */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${
              project.technologies.includes("React")
                ? "rgba(97,218,251,0.1)"
                : "rgba(99,102,241,0.1)"
            }, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Title overlay on image */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <span className="text-2xl font-heading font-bold text-white/20 group-hover:text-white/30 transition-colors text-center">
            {project.title}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-white mb-2 group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-badge text-[10px]">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-badge text-[10px] opacity-60">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <span className="text-xs text-slate-600 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
            View Details <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl glass-strong p-6 md:p-8"
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg glass text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              >
                {cat}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
            {project.title}
          </h2>
          <p className="text-slate-400 leading-relaxed">
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Metrics */}
        {project.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="text-center p-4 rounded-xl glass"
              >
                <div className="text-xl font-heading font-bold gradient-text">
                  {metric.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Architecture */}
        {project.architecture && (
          <div className="mb-8">
            <h3 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-3">
              Architecture
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed p-4 rounded-xl glass">
              {project.architecture}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-8">
          <h3 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-3">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Challenges & Learnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {project.challenges && project.challenges.length > 0 && (
            <div>
              <h3 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-3">
                Challenges
              </h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/60 flex-shrink-0" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {project.learnings && project.learnings.length > 0 && (
            <div>
              <h3 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-3">
                Learnings
              </h3>
              <ul className="space-y-2">
                {project.learnings.map((learning, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500/60 flex-shrink-0" />
                    {learning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05]">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2 px-4"
            >
              <Github className="h-4 w-4" />
              Source Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category.includes(activeFilter));

  const handleSelect = useCallback((project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <section id="projects" className="relative section-padding" aria-label="Projects">
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4 block">
            Portfolio
          </span>
          <h2 className="section-heading mb-6">
            Featured
            <span className="gradient-text"> Projects</span>
          </h2>
          <p className="section-subheading mx-auto">
            A selection of projects that showcase my skills in building
            full-stack applications, AI integrations, and open-source tools.
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal className="flex flex-wrap justify-center gap-2 mb-12">
          {filterCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeFilter === category
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeProjectFilter"
                  className="absolute inset-0 rounded-full bg-indigo-500/20 border border-indigo-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </ScrollReveal>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <StaggerContainer
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={handleSelect}
              />
            ))}
          </StaggerContainer>
        </AnimatePresence>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
