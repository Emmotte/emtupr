import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import DecryptedText from './DecryptedText';

export default function Navigation() {
  const { theme, style, toggleTheme } = useTheme();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Physical', path: '/physical' },
    { name: 'Digital', path: '/digital' },
  ];

  const is95 = style === '95';
  const isRecursive = style === 'recursive';

  const containerClasses = is95 
    ? 'fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b bg-[#c0c0c0] border-b-[#000] border-t-[#fff] border-t-2 border-b-2 shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-sans'
    : `fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b transition-colors duration-300 ${theme === 'dark' ? 'border-neutral-900 bg-[#050505]/80 backdrop-blur-md' : 'bg-white border-b-neutral-200'}`;

  const textClasses = is95
    ? 'text-black'
    : theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900';

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    is95
      ? `hover:text-black border-2 border-transparent hover:border-b-black hover:border-r-black hover:border-t-white hover:border-l-white bg-[#c0c0c0] px-2 py-1 transition-all active:border-b-white active:border-r-white active:border-t-black active:border-l-black ${isActive ? 'text-black border-b-white border-r-white border-t-black border-l-black px-2 py-1 bg-[#d0d0d0]' : ''}`
      : `font-mono transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} ${isActive ? (theme === 'dark' ? 'text-white font-bold' : 'text-black font-bold') : ''}`;

  const iconClasses = is95
    ? 'win95-titlebar-btn !w-6 !h-6 hover:text-black hover:bg-white'
    : `${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'} transition-colors`;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={containerClasses}
    >
      <div className={`text-xl font-bold tracking-tight ${is95 ? 'italic' : theme === 'dark' ? 'font-casual' : ''} ${textClasses}`}>
        {is95 ? <DecryptedText text="Emmett Tupper" /> : "Emmett Tupper"}
      </div>
      
      <nav className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-widest ${is95 ? 'font-sans font-bold' : ''}`}>
        {links.map((link) => (
          <NavLink 
            key={link.name} 
            to={link.path}
            className={navLinkClasses}
          >
            {is95 ? <DecryptedText text={link.name} /> : link.name}
          </NavLink>
        ))}
      </nav>

      <ul className={`flex items-center gap-4 ${is95 ? 'text-[#404040]' : ''}`}>
        <li>
          <button onClick={toggleTheme} className={iconClasses} aria-label="Toggle Theme">
            {is95 ? <Moon className="w-4 h-4" /> : (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
          </button>
        </li>
        <li>
          <a href="mailto:emmetttupper1@gmail.com" className={iconClasses}>
            <Mail className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className={iconClasses}>
            <Linkedin className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a href="#" className={iconClasses}>
            <Github className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </motion.header>
  );
}
