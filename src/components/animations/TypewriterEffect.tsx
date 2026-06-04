"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterEffect({
  words,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const tick = () => {
      if (!isDeleting) {
        // Typing
        setDisplayText(currentWord.substring(0, displayText.length + 1));

        if (displayText.length === currentWord.length) {
          // Pause before deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
          return;
        }

        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else {
        // Deleting
        setDisplayText(currentWord.substring(0, displayText.length - 1));

        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          timeoutRef.current = setTimeout(tick, typingSpeed);
          return;
        }

        timeoutRef.current = setTimeout(tick, deletingSpeed);
      }
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className} aria-label={words[currentWordIndex]}>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayText}
          className="gradient-text-secondary"
        >
          {displayText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className="inline-block w-[3px] h-[1em] ml-1 bg-indigo-400 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        aria-hidden="true"
      />
    </span>
  );
}
