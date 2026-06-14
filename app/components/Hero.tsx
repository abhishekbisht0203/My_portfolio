'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Stack from './Stack'
import { AiAssistant } from '@/app/components/ai-section/AiAssistant';

const images = [
  { id: 1, img: "/images/WhatsApp Image 2026-06-11 at 12.08.42 PM (1).jpeg" },
  { id: 2, img: "/images/WhatsApp Image 2026-06-11 at 1.32.53 PM.jpeg" },
  { id: 3, img: "/images/stack-pic-4.jpg" },
  { id: 4, img: "/images/TrafficFSM.jpg" },
  { id: 5, img: "/images/Abhi.jpeg" },
  { id: 6, img: "/images/Abhishek Bisht.JPG" }
];

const roles = ['Software Engineer', 'Full Stack Developer', 'MERN • Next.js • FastAPI'];

const COLORS = ['#fbbf24', '#fb923c', '#f97316', '#fde68a', '#fdba74'];

function makeParticles() {
  return Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 14 + 10,
    delay: Math.random() * -20,
    driftX: (Math.random() - 0.5) * 30,
    driftY: (Math.random() - 0.5) * 30,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isAiSectionOpen, setIsAiSectionOpen] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [particles, setParticles] = useState<ReturnType<typeof makeParticles>>([]);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParticles(makeParticles());
  }, []);

  useEffect(() => {
    const role = roles[roleIndex];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed === role) {
      t = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed === '') {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % roles.length);
    } else {
      t = setTimeout(() => {
        setDisplayed(deleting
          ? role.slice(0, displayed.length - 1)
          : role.slice(0, displayed.length + 1)
        );
      }, deleting ? 40 : 70);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, roleIndex]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="aurora-bg absolute inset-0" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}`,
            opacity: 0.7,
          }}
          animate={{
            x: [0, p.driftX, 0, -p.driftX, 0],
            y: [0, p.driftY, -p.driftY, p.driftY * 0.5, 0],
            opacity: [0.7, 1, 0.5, 0.9, 0.7],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="flex justify-center mb-8 -mt-8 sm:-mt-16">
            <Stack
              randomRotation={false}
              sensitivity={180}
              sendToBackOnClick={true}
              cardDimensions={{ width: 250, height: 250 }}
              cardsData={images}
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Hey there, I&apos;m{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Abhishek Bisht
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            <span className="font-semibold text-orange-500 dark:text-amber-400">
              {displayed}
              <span className="cursor-blink ml-0.5">|</span>
            </span>
            {' '}Software Engineer with strong expertise in MERN, Next.js, FastAPI, and Django REST Framework, focused on building scalable, production-ready applications.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
            ref={buttonsRef}>

            <button
              onClick={() => scrollToSection('#projects')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-500 transition-all duration-200 transform hover:scale-105"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="px-8 py-3 border-2 border-orange-400 dark:border-amber-500 text-orange-600 dark:text-amber-400 rounded-lg font-semibold hover:bg-orange-50 dark:hover:bg-stone-800 transition-all duration-200"
            >
              Get In Touch
            </button>
            <button
              onClick={() => setIsAiSectionOpen(!isAiSectionOpen)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
            >
              Chat with assistant
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute top-150 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={() => scrollToSection('#about')}
            aria-label="Scroll to about"
            title="Scroll to About section"
            className="animate-bounce"
          >
            <ChevronDown className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </button>
        </motion.div>
      </div>
      <AiAssistant isOpen={isAiSectionOpen} anchorRef={buttonsRef} onClose={() => setIsAiSectionOpen(false)} />
    </section>
  );
}

// add buttonsRef at top of component
