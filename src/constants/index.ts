import type { NavLink, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Abhishek Bisht",
  title: "Abhishek Bisht — Software Engineer",
  description:
    "Software Engineer specializing in building exceptional digital experiences. Focused on creating innovative, high-performance web applications with modern technologies.",
  url: "https://abhishekbisht.dev",
  ogImage: "/images/og-image.png",
  links: [
    { name: "GitHub", url: "https://github.com/abhishekbisht", icon: "github" },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/abhishekbisht",
      icon: "linkedin",
    },
    { name: "Twitter", url: "https://twitter.com/abhishekbisht", icon: "twitter" },
    { name: "Email", url: "mailto:hello@abhishekbisht.dev", icon: "mail" },
  ],
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export const heroRoles = [
  "Software Engineer",
  "Full Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Backend Engineer",
  "AI Enthusiast",
];

export const stats = [
  { label: "Years Experience", value: 4, suffix: "+" },
  { label: "Projects Completed", value: 30, suffix: "+" },
  { label: "GitHub Contributions", value: 1200, suffix: "+" },
  { label: "Technologies Learned", value: 25, suffix: "+" },
];

export const GITHUB_USERNAME = "abhishekbisht";

export const EMAIL_FROM = "hello@abhishekbisht.dev";
export const EMAIL_TO = "hello@abhishekbisht.dev";
