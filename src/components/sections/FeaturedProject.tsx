"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Star, Zap, BarChart3, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { projects } from "@/data/portfolio";

export function FeaturedProject() {
  const featured = projects.find((p) => p.featured);
  if (!featured) return null;

  return (
    <section className="relative section-padding" aria-label="Featured Project">
      <div className="relative mx-auto max-w-7xl">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4 block">
            Case Study
          </span>
          <h2 className="section-heading mb-6">
            Project
            <span className="gradient-text"> Spotlight</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative rounded-3xl glass overflow-hidden">
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Info */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-yellow-500 font-medium">
                        Featured Project
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                      {featured.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      {featured.longDescription || featured.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: Zap, label: "Real-time Collaboration" },
                        { icon: Shield, label: "Enterprise Security" },
                        { icon: BarChart3, label: "Advanced Analytics" },
                        { icon: Star, label: "AI-Powered Insights" },
                      ].map(({ icon: Icon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-3 p-3 rounded-xl glass"
                        >
                          <Icon className="h-4 w-4 text-indigo-400" />
                          <span className="text-sm text-slate-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-sm font-heading font-semibold text-white uppercase tracking-wider mb-3">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {featured.technologies.map((tech) => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4">
                    {featured.githubUrl && (
                      <a
                        href={featured.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        <Github className="h-4 w-4" />
                        Source Code
                      </a>
                    )}
                    {featured.liveUrl && (
                      <a
                        href={featured.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Metrics & Visual */}
                <div className="space-y-8">
                  {/* Preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
                    <div className="absolute inset-0 dot-pattern opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-3 font-heading font-bold text-white/10">
                          {featured.title}
                        </div>
                        <div className="text-sm text-slate-600">
                          Project Preview
                        </div>
                      </div>
                    </div>
                    {/* Browser chrome */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800/80 flex items-center gap-1.5 px-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                  </div>

                  {/* Metrics */}
                  {featured.metrics && (
                    <div className="grid grid-cols-2 gap-4">
                      {featured.metrics.map((metric) => (
                        <motion.div
                          key={metric.label}
                          className="p-4 rounded-xl glass text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-2xl font-heading font-bold gradient-text mb-1">
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-500">
                            {metric.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Architecture note */}
                  {featured.architecture && (
                    <div className="p-4 rounded-xl glass">
                      <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-wider mb-2">
                        Architecture
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {featured.architecture}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
