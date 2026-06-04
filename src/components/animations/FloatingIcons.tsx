"use client";

import { motion } from "framer-motion";

const techIcons = [
  { name: "React", symbol: "⚛", color: "#61DAFB", x: "10%", y: "20%", delay: 0 },
  { name: "Next.js", symbol: "▲", color: "#ffffff", x: "85%", y: "15%", delay: 1 },
  { name: "TypeScript", symbol: "TS", color: "#3178C6", x: "75%", y: "70%", delay: 2 },
  { name: "Node.js", symbol: "⬡", color: "#339933", x: "15%", y: "75%", delay: 1.5 },
  { name: "Python", symbol: "🐍", color: "#3776AB", x: "90%", y: "45%", delay: 0.5 },
  { name: "Docker", symbol: "🐳", color: "#2496ED", x: "5%", y: "50%", delay: 2.5 },
  { name: "AWS", symbol: "☁", color: "#FF9900", x: "70%", y: "85%", delay: 3 },
  { name: "Git", symbol: "", color: "#F05032", x: "25%", y: "90%", delay: 1.8 },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {techIcons.map((icon) => (
        <motion.div
          key={icon.name}
          className="absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl glass text-sm md:text-base font-bold"
          style={{
            left: icon.x,
            top: icon.y,
            color: icon.color,
            textShadow: `0 0 20px ${icon.color}40`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0.6],
            scale: 1,
            y: [0, -15, 5, -15],
            x: [0, 5, -5, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            opacity: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: icon.delay,
            },
            y: {
              duration: 6 + icon.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: icon.delay,
            },
            x: {
              duration: 8 + icon.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: icon.delay,
            },
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: icon.delay,
            },
            scale: {
              duration: 0.5,
              delay: icon.delay + 0.3,
            },
          }}
        >
          <span className="text-lg md:text-xl">{icon.symbol}</span>
        </motion.div>
      ))}
    </div>
  );
}
