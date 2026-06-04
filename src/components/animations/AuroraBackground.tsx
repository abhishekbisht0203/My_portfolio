"use client";

import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

export function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      {/* Primary orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
          top: "10%",
          left: "20%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
          top: "40%",
          right: "10%",
        }}
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -100, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tertiary orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)",
          bottom: "10%",
          left: "40%",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 80, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function CursorGlow() {
  const { x, y } = useMousePosition();

  return (
    <motion.div
      className="cursor-glow hidden lg:block"
      animate={{ x, y }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      aria-hidden="true"
    />
  );
}
