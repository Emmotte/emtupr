import { motion } from 'motion/react';
import { ArrowUpRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Aura App',
    description: 'A minimal habit tracker focused on mental well-being.',
    year: '2025',
    link: '#',
  },
  {
    title: 'Nexus Framework',
    description: 'An open-source UI component library built for speed.',
    year: '2024',
    link: '#',
  },
  {
    title: 'Editorial.co',
    description: 'Digital reading experience for independent magazines.',
    year: '2024',
    link: '#',
  },
  {
    title: 'Typeway',
    description: 'A distraction-free markdown writing environment.',
    year: '2023',
    link: '#',
  },
];

const EXPERIENCES = [
  {
    company: 'Stripe',
    role: 'Senior Product Engineer',
    period: '2022 — Present',
  },
  {
    company: 'Linear',
    role: 'Frontend Developer',
    period: '2020 — 2022',
  },
  {
    company: 'Vercel',
    role: 'Design Engineer Intern',
    period: '2019 — 2020',
  },
];

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-neutral-900 selection:bg-neutral-900 selection:text-[#fafafa] flex flex-col items-center">
      <main className="w-full max-w-2xl px-6 py-20 md:py-32 flex flex-col gap-24">
        {/* --- Hero Section --- */}
        <motion.section
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="flex flex-col gap-6"
        >
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
            <div className="w-16 h-16 rounded-full bg-neutral-200 overflow-hidden mb-6 flex items-center justify-center text-neutral-400">
              {/* Optional: Add an image here instead of the placeholder */}
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900">
            Hi, I'm Taylor.
          </motion.h1>
          <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-neutral-600 leading-relaxed text-lg pb-4">
            I'm a design engineer and product creator based in San Francisco. 
            I care deeply about typography, clean interfaces, and creating fast, accessible web experiences.
          </motion.p>
          
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex gap-4 items-center">
            <a href="mailto:hello@example.com" className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
              <Mail className="w-4 h-4" /> Email Me
            </a>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors">
              <Twitter className="w-4 h-4" /> Twitter
            </a>
          </motion.div>
        </motion.section>

        {/* --- Selected Work --- */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="flex flex-col gap-8"
        >
          <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
            Selected Work
          </motion.h2>
          <div className="flex flex-col gap-6">
            {PROJECTS.map((project, idx) => (
              <motion.a
                key={idx}
                href={project.link}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="group flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-neutral-200/60 pb-6 hover:border-neutral-400 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-medium text-neutral-900 flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                  </h3>
                  <p className="text-sm text-neutral-500">{project.description}</p>
                </div>
                <div className="text-sm font-mono text-neutral-400 whitespace-nowrap">
                  {project.year}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* --- Experience --- */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="flex flex-col gap-8"
        >
          <motion.h2 variants={FADE_UP_ANIMATION_VARIANTS} className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
            Experience
          </motion.h2>
          <div className="flex flex-col">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={idx}
                variants={FADE_UP_ANIMATION_VARIANTS}
                className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 py-4 border-b border-neutral-200/60 last:border-0"
              >
                <div className="text-base text-neutral-900">{exp.company}</div>
                <div className="text-sm text-neutral-500 md:ml-auto md:mr-12">{exp.role}</div>
                <div className="text-sm font-mono text-neutral-400 shrink-0">{exp.period}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- Footer --- */}
        <motion.footer
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="pt-12 text-sm text-neutral-400 flex flex-col sm:flex-row justify-between gap-4"
        >
          <p>© {new Date().getFullYear()} Taylor Doe. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-900 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Twitter</a>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
