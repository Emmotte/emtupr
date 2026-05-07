import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Engineering', path: '/engineering' },
    { name: 'Media', path: '/media' },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 border-b border-neutral-200 dark:border-neutral-900 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md transition-colors duration-300"
    >
      <div className="font-casual text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Emmett Tupper</div>
      
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => 
              `transition-colors hover:text-neutral-900 dark:hover:text-white ${isActive ? 'text-neutral-900 dark:text-white font-bold' : ''}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <ul className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
        <li>
          <button onClick={toggleTheme} className="hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </li>
        <li>
          <a href="mailto:emmetttupper1@gmail.com" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </motion.header>
  );
}
