# Abhishek Bisht - Software Engineer Portfolio

A modern, premium, highly animated software engineer portfolio built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Shadcn/UI.

## 🚀 Features

- **Stunning Animations**: Powered by Framer Motion for smooth, engaging interactions
- **Modern Design**: Glassmorphism, gradient backgrounds, aurora effects, and floating elements
- **Full-Stack**: Built with Next.js 15 App Router, TypeScript, and PostgreSQL
- **Authentication**: Secure login/signup with NextAuth (GitHub, Google, credentials)
- **Contact Form**: Email integration with Resend
- **Blog System**: MDX support with syntax highlighting
- **GitHub Integration**: Dynamic GitHub data fetching
- **Admin Dashboard**: Protected route for managing content
- **SEO Optimized**: Metadata, Open Graph, Twitter Cards, sitemap
- **Accessible**: WCAG compliant with ARIA labels and keyboard navigation
- **Production Ready**: Docker support, environment configuration, deployment guides

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Forms**: React Hook Form with Zod validation
- **Email**: Resend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Images**: Cloudinary
- **State Management**: React Query
- **Deployment**: Vercel (ready)

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── (layout)/           # Layout components
│   ├── about/              # About page
│   ├── achievements/       # Achievements page
│   ├── api/                # API routes
│   ├── blog/               # Blog section
│   ├── contact/            # Contact page
│   ├── experience/         # Experience section
│   ├── featured/           # Featured project showcase
│   ├── github/             # GitHub integration
│   ├── projects/           # Projects section
│   ├── skills/             # Skills section
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── layout/             # Layout components (navbar, etc.)
│   └── ui/                 # Shadcn UI components
├── lib/                    # Utility functions and services
├── hooks/                  # Custom React hooks
├── services/               # Service layer for API calls
├── actions/                # Server actions
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── middleware/             # Custom middleware
└── ...
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL
- GitHub account (for GitHub API)
- Cloudinary account (for image storage)
- Resend account (for email sending)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

# Resend (for email)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM=onboarding@resend.dev

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# GitHub (for GitHub API)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
npm start
```

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Mobile devices
- Tablets
- Laptops
- Desktop screens
- Ultra-wide monitors

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Proper color contrast ratios
- Focus visible outlines

## 🚀 Deployment

The portfolio is ready for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project on Vercel
3. Add the environment variables in Vercel settings
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Apple.com, Stripe.com, Linear.app, and Vercel.com designs
- Built with love using modern web technologies
- Special thanks to the open-source community for the amazing tools used

---

**Developed by Abhishek Bisht**  
Software Engineer | Full Stack Developer | React Specialist  
[GitHub](https://github.com/abhishekbisht) | [LinkedIn](https://linkedin.com/in/abhishekbisht) | [Twitter](https://twitter.com/abhishekbisht)