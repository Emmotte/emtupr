import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Navigation() {
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
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 border-b border-neutral-900 bg-[#050505]/80 backdrop-blur-md"
    >
      <div className="font-casual text-xl font-bold tracking-tight">emtup works.</div>
      
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-neutral-400">
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => 
              `transition-colors hover:text-white ${isActive ? 'text-white font-bold' : ''}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <ul className="flex items-center gap-4 text-neutral-400">
        <li>
          <a href="mailto:emmetttupper1@gmail.com" className="hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </motion.header>
  );
}
