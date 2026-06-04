import type {
  Skill,
  Experience,
  Project,
  Achievement,
  Testimonial,
} from "@/types";

// ─── Skills Data ──────────────────────────────────────────────

export const skills: Skill[] = [
  // Frontend
  { name: "HTML5", icon: "html5", level: 95, category: "Frontend", color: "#E34F26" },
  { name: "CSS3", icon: "css3", level: 92, category: "Frontend", color: "#1572B6" },
  { name: "JavaScript", icon: "javascript", level: 93, category: "Frontend", color: "#F7DF1E" },
  { name: "TypeScript", icon: "typescript", level: 90, category: "Frontend", color: "#3178C6" },
  { name: "React", icon: "react", level: 95, category: "Frontend", color: "#61DAFB" },
  { name: "Next.js", icon: "nextjs", level: 92, category: "Frontend", color: "#ffffff" },
  { name: "Redux", icon: "redux", level: 85, category: "Frontend", color: "#764ABC" },

  // Backend
  { name: "Node.js", icon: "nodejs", level: 90, category: "Backend", color: "#339933" },
  { name: "Express", icon: "express", level: 88, category: "Backend", color: "#ffffff" },
  { name: "Django", icon: "django", level: 80, category: "Backend", color: "#092E20" },
  { name: "FastAPI", icon: "fastapi", level: 82, category: "Backend", color: "#009688" },

  // Database
  { name: "PostgreSQL", icon: "postgresql", level: 88, category: "Database", color: "#4169E1" },
  { name: "MongoDB", icon: "mongodb", level: 85, category: "Database", color: "#47A248" },
  { name: "MySQL", icon: "mysql", level: 83, category: "Database", color: "#4479A1" },
  { name: "Redis", icon: "redis", level: 78, category: "Database", color: "#DC382D" },

  // Cloud & DevOps
  { name: "AWS", icon: "aws", level: 80, category: "Cloud & DevOps", color: "#FF9900" },
  { name: "Docker", icon: "docker", level: 82, category: "Cloud & DevOps", color: "#2496ED" },
  { name: "Nginx", icon: "nginx", level: 75, category: "Cloud & DevOps", color: "#009639" },
  { name: "GitHub Actions", icon: "githubactions", level: 80, category: "Cloud & DevOps", color: "#2088FF" },

  // AI & Tools
  { name: "OpenAI", icon: "openai", level: 85, category: "AI & Tools", color: "#412991" },
  { name: "Claude API", icon: "claude", level: 83, category: "AI & Tools", color: "#D97757" },
  { name: "LangChain", icon: "langchain", level: 78, category: "AI & Tools", color: "#1C3C3C" },
  { name: "Vector DBs", icon: "database", level: 75, category: "AI & Tools", color: "#8B5CF6" },
];

// ─── Experience Data ──────────────────────────────────────────

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "TechCorp Solutions",
    role: "Senior Software Engineer",
    type: "Full-time",
    startDate: "2023-01",
    endDate: "Present",
    location: "San Francisco, CA (Remote)",
    description:
      "Leading the frontend architecture for a high-traffic SaaS platform serving 50K+ daily active users. Driving performance optimization initiatives and mentoring junior developers.",
    achievements: [
      "Architected and shipped a micro-frontend system reducing deploy times by 60%",
      "Led migration from CRA to Next.js 14, improving LCP by 45%",
      "Built a real-time collaboration engine using WebSockets and CRDTs",
      "Mentored 4 junior developers through structured code review processes",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS", "Docker"],
  },
  {
    id: "exp-2",
    company: "InnovateLab AI",
    role: "Full Stack Developer",
    type: "Full-time",
    startDate: "2022-03",
    endDate: "2022-12",
    location: "New York, NY",
    description:
      "Developed AI-powered web applications integrating LLMs, vector databases, and modern web frameworks. Built internal tools that automated 70% of manual data processing workflows.",
    achievements: [
      "Built an AI-powered document analysis platform processing 10K+ documents/day",
      "Integrated OpenAI GPT-4 and Claude APIs for intelligent content generation",
      "Designed RESTful APIs serving 2M+ requests/month with 99.9% uptime",
      "Reduced infrastructure costs by 35% through serverless architecture migration",
    ],
    technologies: ["React", "Node.js", "Python", "OpenAI", "Pinecone", "AWS Lambda"],
  },
  {
    id: "exp-3",
    company: "StartupHub",
    role: "Frontend Developer",
    type: "Full-time",
    startDate: "2021-06",
    endDate: "2022-02",
    location: "Bangalore, India",
    description:
      "Core frontend developer for an early-stage startup building a developer tools platform. Shipped features at high velocity while maintaining code quality and test coverage.",
    achievements: [
      "Built the entire frontend from scratch using React and TypeScript",
      "Implemented a component library used across 3 products",
      "Achieved 95+ Lighthouse score across all pages",
      "Set up CI/CD pipelines reducing deployment time from 30min to 5min",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Jest", "GitHub Actions"],
  },
  {
    id: "exp-4",
    company: "Freelance",
    role: "Web Developer",
    type: "Freelance",
    startDate: "2020-01",
    endDate: "2021-05",
    location: "Remote",
    description:
      "Delivered 15+ web projects for clients across e-commerce, education, and healthcare domains. Built responsive, accessible, and performant websites and web applications.",
    achievements: [
      "Delivered 15+ client projects with 100% satisfaction rate",
      "Built an e-commerce platform generating $50K+ monthly revenue for client",
      "Developed a telemedicine platform used by 5000+ patients",
      "Maintained long-term relationships with 8 recurring clients",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express", "WordPress", "Shopify"],
  },
];

// ─── Projects Data ────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: "proj-1",
    title: "NexusAI Platform",
    slug: "nexusai-platform",
    description:
      "An AI-powered content generation and analysis platform with real-time collaboration features.",
    longDescription:
      "NexusAI is a cutting-edge SaaS platform that leverages large language models to help teams create, analyze, and optimize content at scale. Features include real-time collaborative editing, AI-powered suggestions, document analysis with RAG, and automated content workflows. The platform processes over 10,000 documents daily and serves 5,000+ active users.",
    image: "/projects/nexusai.png",
    screenshots: ["/projects/nexusai-1.png", "/projects/nexusai-2.png"],
    technologies: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL", "Redis", "Docker"],
    category: ["Web Apps", "AI", "Full Stack"],
    githubUrl: "https://github.com/abhishekbisht/nexusai",
    liveUrl: "https://nexusai.demo.dev",
    featured: true,
    architecture: "Microservices architecture with Next.js frontend, FastAPI backend, PostgreSQL for structured data, Pinecone for vector embeddings, and Redis for caching and real-time features.",
    challenges: [
      "Implementing real-time collaboration with conflict resolution using CRDTs",
      "Optimizing LLM inference costs while maintaining low latency",
      "Building a scalable document processing pipeline for 10K+ docs/day",
    ],
    learnings: [
      "Deep understanding of RAG patterns and vector database optimization",
      "Real-time system design with WebSockets and conflict resolution",
      "Cost optimization strategies for AI-powered applications",
    ],
    metrics: [
      { label: "Daily Users", value: "5,000+" },
      { label: "Documents/Day", value: "10,000+" },
      { label: "API Uptime", value: "99.9%" },
      { label: "Avg Response", value: "<200ms" },
    ],
  },
  {
    id: "proj-2",
    title: "DevFlow",
    slug: "devflow",
    description:
      "A developer productivity platform with integrated code review, project management, and CI/CD.",
    longDescription:
      "DevFlow streamlines the software development lifecycle by combining code review, project management, and deployment in a single unified platform. Built with a focus on developer experience, it features an AI-powered code review assistant, automated workflow pipelines, and real-time team collaboration.",
    image: "/projects/devflow.png",
    technologies: ["React", "Node.js", "GraphQL", "MongoDB", "Docker", "AWS"],
    category: ["Web Apps", "Full Stack"],
    githubUrl: "https://github.com/abhishekbisht/devflow",
    liveUrl: "https://devflow.demo.dev",
    featured: false,
    challenges: [
      "Designing a flexible plugin architecture for custom integrations",
      "Building a performant code diff viewer supporting 50+ languages",
    ],
    learnings: [
      "GraphQL schema design for complex relational data",
      "Building extensible plugin systems in Node.js",
    ],
  },
  {
    id: "proj-3",
    title: "CloudSync",
    slug: "cloudsync",
    description:
      "Real-time file synchronization and backup service with end-to-end encryption.",
    longDescription:
      "CloudSync provides seamless file synchronization across devices with military-grade encryption. Features include selective sync, version history, shared workspaces, and conflict resolution. The system handles 1TB+ of data transfers daily.",
    image: "/projects/cloudsync.png",
    technologies: ["Next.js", "Rust", "PostgreSQL", "S3", "WebSockets", "Docker"],
    category: ["Full Stack", "Open Source"],
    githubUrl: "https://github.com/abhishekbisht/cloudsync",
    featured: false,
    challenges: [
      "Implementing efficient delta sync for large files",
      "Designing a conflict resolution strategy for concurrent edits",
    ],
    learnings: [
      "Low-level file system APIs and efficient data streaming",
      "Cryptographic best practices for end-to-end encryption",
    ],
  },
  {
    id: "proj-4",
    title: "EcoTrack",
    slug: "ecotrack",
    description:
      "Carbon footprint tracking app with AI-powered sustainability recommendations.",
    longDescription:
      "EcoTrack helps individuals and organizations track, analyze, and reduce their carbon footprint. Uses machine learning to provide personalized sustainability recommendations and tracks progress over time with beautiful data visualizations.",
    image: "/projects/ecotrack.png",
    technologies: ["React Native", "Python", "FastAPI", "TensorFlow", "PostgreSQL"],
    category: ["AI", "Full Stack"],
    githubUrl: "https://github.com/abhishekbisht/ecotrack",
    liveUrl: "https://ecotrack.demo.dev",
    featured: false,
  },
  {
    id: "proj-5",
    title: "OpenAPI Toolkit",
    slug: "openapi-toolkit",
    description:
      "Open-source CLI and library for generating type-safe API clients from OpenAPI specs.",
    longDescription:
      "A comprehensive toolkit for working with OpenAPI specifications. Includes a CLI for generating type-safe clients in TypeScript, Python, and Go, a validation library, and a documentation generator. Used by 500+ developers worldwide.",
    image: "/projects/openapi-toolkit.png",
    technologies: ["TypeScript", "Node.js", "Go", "CLI", "npm"],
    category: ["Open Source"],
    githubUrl: "https://github.com/abhishekbisht/openapi-toolkit",
    featured: false,
  },
  {
    id: "proj-6",
    title: "MediConnect",
    slug: "mediconnect",
    description:
      "Telemedicine platform connecting patients with healthcare providers for virtual consultations.",
    longDescription:
      "A HIPAA-compliant telemedicine platform enabling virtual doctor consultations, prescription management, and health record tracking. Features include video calling, appointment scheduling, payment processing, and a patient health dashboard.",
    image: "/projects/mediconnect.png",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "WebRTC", "Stripe", "AWS"],
    category: ["Web Apps", "Full Stack"],
    githubUrl: "https://github.com/abhishekbisht/mediconnect",
    featured: false,
  },
];

// ─── Achievements Data ────────────────────────────────────────

export const achievements: Achievement[] = [
  {
    id: "ach-1",
    title: "Winner — HackTheNorth 2023",
    description:
      "Built an AI-powered accessibility tool that won 1st place among 200+ teams at Canada's largest hackathon.",
    type: "Hackathon",
    date: "2023-09",
    icon: "trophy",
    link: "https://hackthenorth.com",
    issuer: "Hack the North",
  },
  {
    id: "ach-2",
    title: "AWS Solutions Architect Associate",
    description:
      "Earned AWS certification demonstrating expertise in designing distributed systems on AWS cloud.",
    type: "Certification",
    date: "2023-06",
    icon: "award",
    issuer: "Amazon Web Services",
  },
  {
    id: "ach-3",
    title: "Top 100 Contributors — React",
    description:
      "Recognized as a top 100 contributor to the React open-source ecosystem with 50+ merged PRs.",
    type: "Open Source",
    date: "2023-12",
    icon: "git-pull-request",
    link: "https://github.com/facebook/react",
    issuer: "Meta Open Source",
  },
  {
    id: "ach-4",
    title: "Google Developer Expert Nominee",
    description:
      "Nominated for the Google Developer Expert program in Web Technologies for community contributions.",
    type: "Award",
    date: "2024-01",
    icon: "star",
    issuer: "Google",
  },
  {
    id: "ach-5",
    title: "Best Developer Portfolio — Devfolio",
    description:
      "Recognized for having one of the most impactful developer portfolios showcasing innovative projects.",
    type: "Award",
    date: "2023-11",
    icon: "sparkles",
    issuer: "Devfolio",
  },
  {
    id: "ach-6",
    title: "Meta Hacker Cup — Round 2",
    description:
      "Advanced to Round 2 of Meta Hacker Cup competitive programming contest, placing in top 5% globally.",
    type: "Hackathon",
    date: "2023-10",
    icon: "code",
    issuer: "Meta",
  },
];

// ─── Testimonials Data ────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp Solutions",
    avatar: "/testimonials/sarah.jpg",
    content:
      "Abhishek is one of the most talented engineers I've worked with. His ability to architect complex systems while maintaining clean, readable code is exceptional. He led our Next.js migration and the results exceeded all expectations.",
    rating: 5,
  },
  {
    id: "test-2",
    name: "Marcus Johnson",
    role: "CTO",
    company: "InnovateLab AI",
    avatar: "/testimonials/marcus.jpg",
    content:
      "Working with Abhishek was a game-changer for our AI platform. He brought deep technical expertise in both frontend and AI integration, delivering features that our users absolutely love. His attention to performance and UX is unmatched.",
    rating: 5,
  },
  {
    id: "test-3",
    name: "Emily Rodriguez",
    role: "Product Designer",
    company: "StartupHub",
    avatar: "/testimonials/emily.jpg",
    content:
      "As a designer, I appreciate developers who understand and elevate design. Abhishek consistently turns complex designs into pixel-perfect, animated interfaces. His eye for micro-interactions and polish is remarkable.",
    rating: 5,
  },
  {
    id: "test-4",
    name: "David Park",
    role: "Founder & CEO",
    company: "CloudSync Inc.",
    avatar: "/testimonials/david.jpg",
    content:
      "Abhishek built our entire frontend from scratch and it's been rock-solid. His code quality, documentation, and proactive communication made the collaboration seamless. I'd hire him again in a heartbeat.",
    rating: 5,
  },
];
