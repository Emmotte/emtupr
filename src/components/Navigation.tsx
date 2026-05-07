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
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-neutral-900 bg-[#050505]/80 backdrop-blur-md' : 'bg-[#c0c0c0] border-b-[#000] border-t-[#fff] border-t-2 border-b-2 shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-sans'}`}
    >
      <div className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'font-casual text-neutral-100' : 'font-sans text-black italic'}`}>Emmett Tupper</div>
      
      <nav className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-widest ${theme === 'dark' ? 'font-mono text-neutral-400' : 'font-sans font-bold text-[#404040]'}`}>
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={({ isActive }) => 
              `${theme === 'dark' ? 'transition-colors hover:text-white' : 'hover:text-black border-2 border-transparent hover:border-b-black hover:border-r-black hover:border-t-white hover:border-l-white bg-[#c0c0c0] px-2 py-1 transition-all active:border-b-white active:border-r-white active:border-t-black active:border-l-black'} ${isActive ? (theme === 'dark' ? 'text-white font-bold' : 'text-black border-b-white border-r-white border-t-black border-l-black px-2 py-1 bg-[#d0d0d0]') : ''}`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <ul className={`flex items-center gap-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-[#404040]'}`}>
        <li>
          <button onClick={toggleTheme} className={theme === 'dark' ? 'hover:text-white transition-colors' : 'win95-titlebar-btn !w-6 !h-6 hover:text-black hover:bg-white'} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </li>
        <li>
          <a href="mailto:emmetttupper1@gmail.com" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'win95-titlebar-btn !w-6 !h-6 hover:text-black hover:bg-white'}>
            <Mail className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'win95-titlebar-btn !w-6 !h-6 hover:text-black hover:bg-white'}>
            <Linkedin className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className={theme === 'dark' ? 'hover:text-white transition-colors' : 'win95-titlebar-btn !w-6 !h-6 hover:text-black hover:bg-white'}>
            <Github className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </motion.header>
  );
}
