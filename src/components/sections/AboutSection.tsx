"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Heart, Zap } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { stats } from "@/constants";

function StatCard({
  label,
  value,
  suffix = "",
  delay = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
}) {
  const { ref, displayValue } = useCountUp({ end: value, suffix, delay });

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold gradient-text mb-2">
        {displayValue}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

const journeyItems = [
  {
    icon: Code2,
    title: "The Beginning",
    description:
      "Started my journey with HTML, CSS, and JavaScript. Built my first website at 16 and fell in love with creating digital experiences.",
  },
  {
    icon: Rocket,
    title: "Going Full Stack",
    description:
      "Expanded into backend development with Node.js, databases, and cloud infrastructure. Embraced TypeScript and modern frameworks.",
  },
  {
    icon: Zap,
    title: "AI & Innovation",
    description:
      "Diving deep into AI/ML integration, building intelligent applications with LLMs, and exploring the intersection of AI and web development.",
  },
  {
    icon: Heart,
    title: "Giving Back",
    description:
      "Contributing to open source, mentoring aspiring developers, and sharing knowledge through technical writing and community building.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative section-padding" aria-label="About Me">
      {/* Section background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,1), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-4 block">
            About Me
          </span>
          <h2 className="section-heading mb-6">
            Crafting Digital
            <span className="gradient-text"> Experiences</span>
          </h2>
          <p className="section-subheading mx-auto">
            A passionate software engineer with a love for building beautiful,
            performant applications that make a difference.
          </p>
        </ScrollReveal>

        {/* Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Text */}
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                Hi! I&apos;m <span className="text-white font-semibold">Abhishek Bisht</span>,
                a software engineer who thrives at the intersection of design and
                engineering. I specialize in building full-stack web applications
                with modern JavaScript frameworks and cloud-native architectures.
              </p>
              <p className="text-slate-400 leading-relaxed">
                With over 4 years of experience, I&apos;ve had the privilege of
                working with startups and tech companies, building products that
                serve thousands of users. I&apos;m passionate about clean code,
                beautiful UI, and solving complex problems with elegant solutions.
              </p>
              <p className="text-slate-400 leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me contributing to
                open-source projects, writing technical blogs, or exploring the
                latest in AI and machine learning. I believe in continuous
                learning and sharing knowledge with the community.
              </p>

              {/* Quick facts */}
              <div className="flex flex-wrap gap-3 pt-4">
                {["🎯 Problem Solver", "🚀 Fast Learner", "💡 Creative Thinker", "🤝 Team Player"].map(
                  (fact) => (
                    <span key={fact} className="tech-badge text-sm py-1.5 px-3">
                      {fact}
                    </span>
                  )
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Journey Timeline */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-6">
              {journeyItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex gap-4 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl glass group-hover:bg-indigo-500/10 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-12 rounded-2xl glass">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                delay={index * 200}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
