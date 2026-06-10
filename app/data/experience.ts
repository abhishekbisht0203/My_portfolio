export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
  type: 'work' | 'internship' | 'project' | 'education';
}

export const experiences: Experience[] = [
  {
    id: 3,
    title: "Software Engineer",
    company: "Vahanfin Solutions Pvt. Ltd.",
    location: "Nainital, Uttarakhand, India",
    duration: "Feb 2026 - May 2026",
    description: "Built and deployed a scalable E-challan admin dashboard using Next.js, Node.js, and MongoDB to improve operational workflows.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs", "Role-Based Access Control"],
    achievements: [
      "Built and deployed a scalable E-challan admin dashboard, improving operational workflow efficiency",
      "Designed and optimized REST APIs for vehicle challan data enabling fast filtering, reporting, and real-time access",
      "Implemented role-based dashboards (RMCC, RMI, Admin) to streamline multi-user workflows and access control",
      "Developed dynamic data tables with Excel/CSV export and preset filters (7 days, 30 days, yearly) for accurate reporting",
      "Improved backend performance by optimizing database queries, significantly reducing API response times"
    ],
    type: "work"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Dexplovate Pvt. Ltd.",
    location: "India",
    duration: "May 2025 - Nov 2025",
    description: "Led development of scalable applications using the MERN stack and FastAPI, focusing on modularity and performance.",
    technologies: ["MERN", "FastAPI", "Node.js", "Express", "MongoDB", "PostgreSQL"],
    achievements: [
      "Led development of scalable applications using MERN and FastAPI, improving system modularity and performance",
      "Architected MongoDB and PostgreSQL schemas to enable efficient data handling and scalable workflows",
      "Built high-performance APIs and integrated them with React frontends for a seamless user experience",
      "Delivered real-time features and UI/UX improvements through cross-functional collaboration"
    ],
    type: "work"
  },
  {
    id: 1,
    title: "Python Full Stack Developer",
    company: "CADL (Chandigarh Academy of Digital Learning)",
    location: "India",
    duration: "Apr 2024 - Apr 2025",
    description: "Engineered scalable web applications using Django REST Framework and modern frontends to improve API efficiency and user experience.",
    technologies: ["Django REST Framework", "Python", "React", "Tailwind CSS", "WebSockets", "Razorpay"],
    achievements: [
      "Engineered scalable web applications using Django REST Framework, improving API efficiency and performance",
      "Implemented secure authentication systems, enhancing data protection and system reliability",
      "Built responsive UIs using React and Tailwind to improve cross-device usability",
      "Integrated third-party APIs, payment gateways, and WebSockets to extend platform functionality"
    ],
    type: "work"
  },
];
