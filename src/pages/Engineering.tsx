import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';

import TextType from '../components/TextType';
import DecryptedText from '../components/DecryptedText';

export const ENGINEERING_PROJECTS = [
  {
    id: 'network',
    title: 'Enterprise Architecture & Routing',
    category: 'Engineering',
    role: 'Senior Network Engineer',
    period: '2021 — Present',
    description: 'Designed and implemented scalable, high-availability enterprise networks. Specialized in BGP/OSPF routing, switching, and advanced firewall configuration to ensure zero-trust security compliance.',
    content: '### Overview\nThis project involved a complete overhaul of the enterprise network architecture. We moved from a legacy hub-and-spoke model to a modernized spine-leaf topology.\n\n### Challenges\n- Zero-downtime migration\n- Integrating zero-trust security policies\n\n### Implementation Details\nConfigured BGP as the primary routing protocol for the WAN overlay, and OSPF for internal distribution...',
    tags: ['Cisco', 'Juniper', 'Palo Alto', 'BGP', 'OSPF']
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure Setup',
    category: 'Engineering',
    role: 'Systems Architect',
    period: '2018 — 2021',
    description: 'Deployed resilient cloud networking solutions across AWS and Azure. Automated infrastructure provisioning using Terraform and CI/CD pipelines, increasing deployment speed by 60%.',
    content: '### Overview\nBuilt robust and self-healing infrastructure in AWS and Azure to handle high-traffic workloads.\n\n### Automation\nUsing Terraform to manage IaC, we brought provisioning time down from weeks to hours.',
    tags: ['AWS', 'Azure', 'Terraform', 'Python']
  },
  {
    id: 'nexus',
    title: 'Nexus UI Framework',
    category: 'Design',
    role: 'Lead UX/UI Designer',
    period: '2022 — Present',
    description: 'Developed an open-source, accessible UI component library. Conducted extensive user research to refine interaction models, resulting in a minimalist and highly intuitive design system.',
    content: '### Project Genesis\nNexus UI was born out of a need for a truly unstyled but fully accessible foundational component library.\n\n### The Process\nThrough rigorous user testing, we identified standard interaction models and codified them into React hooks and components.',
    tags: ['Figma', 'React', 'Tailwind CSS', 'User Research']
  },
  {
    id: 'aura',
    title: 'Aura Analytics Dashboard',
    category: 'Design',
    role: 'Product Designer',
    period: '2020 — 2022',
    description: 'Architected the core data visualization experience for a SaaS analytics tool. Translated complex data streams into elegant, digestible dashboards.',
    content: '### Visualization Strategy\nUsing D3.js to render highly performant data charts that scale to thousands of data points without dropping frames.\n\n### Results\nImproved user retention by 25% due to the new insights surfaced by the dashboard.',
    tags: ['Prototyping', 'Wireframing', 'D3.js']
  }
];

export default function Engineering() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, style } = useTheme();

  const filteredProjects = ENGINEERING_PROJECTS.filter(project => 
    searchQuery === '' ? true : 
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`max-w-4xl mx-auto w-full relative ${theme === 'dark' ? 'px-6 py-24' : 'px-8 py-28'}`}
    >
      <header className={`mb-12 relative z-10 ${theme === 'dark' ? '' : 'scrapbook-cutout'}`}>
        <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-4 ${theme === 'dark' ? 'text-neutral-100' : 'text-black'}`}>
          {style === '95' ? <DecryptedText text="Engineering & Design" /> : "Engineering & Design"}
        </h1>
      </header>
      {theme === 'light' && (
        <p className="font-mono text-black text-sm md:text-base leading-relaxed max-w-2xl bg-white border-2 border-black p-4 shadow-[4px_4px_0_#000] rotate-1 mb-12 relative z-10 w-fit">
          {style === '95' ? (
            <DecryptedText 
              text="Bridging the gap between robust network infrastructure and intuitive product design. Building systems that are reliable at the core and elegant at the surface." 
              speed={30}
            />
          ) : (
            "Bridging the gap between robust network infrastructure and intuitive product design. Building systems that are reliable at the core and elegant at the surface."
          )}
        </p>
      )}
      {theme === 'dark' && (
        <p className="font-mono text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mb-12">
          {style === '95' ? (
            <DecryptedText 
              text="Bridging the gap between robust network infrastructure and intuitive product design. Building systems that are reliable at the core and elegant at the surface." 
              speed={30}
            />
          ) : (
            "Bridging the gap between robust network infrastructure and intuitive product design. Building systems that are reliable at the core and elegant at the surface."
          )}
        </p>
      )}

      <div className={`mb-12 relative ${theme === 'dark' ? '' : 'win95-window'}`}>
        {theme === 'light' && (
           <div className="win95-titlebar mb-1">
             <span>search_engine.exe</span>
             <div className="flex gap-1">
               <div className="win95-titlebar-btn">X</div>
             </div>
           </div>
        )}
        <div className={`${theme === 'light' ? 'win95-body relative' : ''}`}>
          <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${theme === 'light' ? 'pl-6 pb-2' : 'pl-3'}`}>
            <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-neutral-500' : 'text-black'}`} />
          </div>
          <input
            type="text"
            placeholder="Search projects by skill or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
          />
        </div>
      </div>

      <div className="space-y-16">
        {filteredProjects.length > 0 ? filteredProjects.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 transition-[opacity,transform] mb-8 ${theme === 'dark' ? 'border-l border-neutral-800 pl-6' : 'scrapbook-element polaroid'}`}
          >
            {theme === 'dark' && <div className="absolute w-2 h-2 bg-neutral-800 rounded-full -left-[4.5px] top-2 transition-colors duration-300 group-hover:bg-neutral-400" />}
            {theme === 'light' && <div className="tape hidden sm:block"></div>}
            
            <header className={`z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide sm:col-span-2 font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>
              {item.period}
            </header>
            
            <div className="z-10 sm:col-span-6 flex flex-col">
              <Link to={`/project/${item.id}`} className={`inline-block transition-colors ${theme === 'dark' ? 'group-hover:text-white' : 'hover:bg-[#000080] hover:text-white w-fit px-1'}`}>
                <h3 className={`font-medium leading-snug text-xl ${theme === 'dark' ? 'text-neutral-200 font-display' : 'font-sans text-black font-bold'}`}>
                  {item.title}
                </h3>
              </Link>
              <div className={`text-sm mt-1 font-mono ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>{item.role}</div>

              <p className={`mt-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-400' : 'text-black font-serif'}`}>
                {item.description}
              </p>
              
              <Link to={`/project/${item.id}`} className={`mt-4 font-mono flex items-center gap-2 text-xs uppercase tracking-widest hover:text-neutral-900 transition-colors w-max ${theme === 'dark' ? 'text-neutral-500 dark:hover:text-white' : 'text-[#808080] font-bold hover:!text-[#000080]'}`}>
                 Read details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
                {item.tags.map(tag => (
                  <li key={tag}>
                    <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5 font-mono ${theme === 'dark' ? 'bg-neutral-900 border border-neutral-800 text-neutral-300' : 'border border-black bg-white text-black shadow-[2px_2px_0px_#000]'}`}>
                      {tag}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )) : (
          <div className={`font-mono text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>No projects matching "{searchQuery}"</div>
        )}
      </div>
    </motion.div>
  );
}
