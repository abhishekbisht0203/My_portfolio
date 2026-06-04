// ─── Portfolio Types ──────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: SocialLink[];
}

// ─── Skills ───────────────────────────────────────────────────

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Cloud & DevOps"
  | "AI & Tools";

export interface Skill {
  name: string;
  icon: string;
  level: number; // 0-100
  category: SkillCategory;
  color?: string;
}

// ─── Experience ───────────────────────────────────────────────

export interface Experience {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship";
  startDate: string;
  endDate: string | "Present";
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// ─── Projects ─────────────────────────────────────────────────

export type ProjectCategory =
  | "All"
  | "Web Apps"
  | "Full Stack"
  | "AI"
  | "Open Source";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  image: string;
  screenshots?: string[];
  technologies: string[];
  category: ProjectCategory[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  architecture?: string;
  challenges?: string[];
  learnings?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

// ─── Achievements ─────────────────────────────────────────────

export type AchievementType =
  | "Hackathon"
  | "Certification"
  | "Award"
  | "Open Source";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  date: string;
  icon: string;
  link?: string;
  issuer?: string;
}

// ─── Testimonials ─────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

// ─── Blog ─────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readingTime: number;
  published: boolean;
}

// ─── Contact ──────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── GitHub ───────────────────────────────────────────────────

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalContributions: number;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}
