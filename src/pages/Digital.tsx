import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';

import TextType from '../components/TextType';
import DecryptedText from '../components/DecryptedText';

export const DIGITAL_PROJECTS = [
  {
    id: 'wet-knee',
    category: 'Photography',
    title: 'Wet Knee Photoshoot',
    role: 'Photographer',
    period: '2026',
    description: 'Band promotional shoot capturing raw energy and the local atmosphere.',
    content: '### Overview\nA candid photoshoot for my band, Wet Knee. We focused on raw urban textures to complement our sound.\n\n### Gallery\n- IMG_7755.jpg\n- IMG_7741.jpg\n- IMG_7777.jpg\n- IMG_7782.jpg\n- IMG_7850.jpg\n- IMG_7881.jpg\n- IMG_7889.jpg\n- IMG_7910.jpg\n- IMG_7912.jpg\n- IMG_7739.jpg\n- IMG_7844-3.jpg\n- IMG_7886.jpg\n- IMG_7902.jpg\n- IMG_7904.jpg\n- IMG_7908.jpg\n- IMG_7918.jpg\n- IMG_7922-2.jpg\n- IMG_7923.jpg\n- IMG_7835.jpg\n- IMG_7839-2.jpg\n- IMG_7840.jpg\n- IMG_7880.jpg\n- IMG_7780.jpg\n- IMG_7761.jpg\n- IMG_7751.jpg\n- IMG_7751-2.jpg\n- IMG_7761-2.jpg\n- IMG_7886-2.jpg\n- IMG_7894.jpg\n- IMG_7887.jpg',
    tags: ['Canon T2i', 'Lightroom', 'Band Photography'],
    thumbnail: '/IMG_7902-2.jpg'
  },
  {
    id: 'digital-junk',
    category: 'Video',
    title: 'Digital Junk Collective',
    role: 'Director / Editor',
    period: '2023',
    description: 'Directed and edited a stylized short film exploring the aesthetic of digital degradation and artifacts. Managed color grading and VFX pipelines.',
    content: '### Direction\nExploring the beauty in broken things. We deliberately degraded 4K footage using analog tape workflows to create a unique texture.\n\n### Impact\nScreened at three underground video art festivals in 2023.',
    tags: ['Premiere Pro', 'After Effects', 'Color Grading'],
    thumbnail: '/IMG_6367.jpg'
  },
  {
    id: 'urban',
    category: 'Photography',
    title: 'Urban Spaces & People',
    role: 'Photographer',
    period: '2016 — Present',
    description: 'Ongoing photographic series documenting the intersection of modern architecture and human interaction. Exhibited in local galleries.',
    content: '### Process\nShot entirely on 35mm film across various global cities. The focus is on finding stillness in chaotic environments.\n\n### Exhibitions\n- "Concrete & Glass", 2019\n- "The Spaces Between", 2021',
    tags: ['Portraiture', 'Street Photography', 'Lightroom'],
    thumbnail: '/IMG_6407.jpg'
  },
  {
    id: 'live',
    category: 'Audio',
    title: 'Live Electronic Performances',
    role: 'Performer & Sound Designer',
    period: '2019 — Present',
    description: 'Crafted improvisational live sets blending hip-hop beats with generative electronic soundscapes. Utilized analog synthesizers and custom software patches.',
    content: '### Setup\nHardware-centric live setup using Elektron rhythm machines and Moog synthesizers sequenced via Ableton Live.\n\n### Philosophy\nNo two performances are ever the same. The generative elements allow for structured improvisation.',
    tags: ['Ableton Live', 'Max/MSP', 'Sound Design'],
    thumbnail: '/IMG_6406.jpg'
  },
  {
    id: 'studio',
    category: 'Audio',
    title: 'Studio Mixing & Mastering',
    role: 'Audio Engineer',
    period: '2017 — Present',
    description: 'Delivered professional mixing and mastering for independent artists. Focused on achieving pristine clarity and dynamic range across multiple genres.',
    content: '### Technical Approach\nHybrid analog/digital workflow. Using high-end outboard gear for color and warmth, and precise digital EQs for surgical corrections.\n\n### Client Success\nSeveral tracks mixed in this studio have gone on to reach top spots on streaming playlists.',
    tags: ['Pro Tools', 'Logic Pro', 'Mixing', 'Mastering'],
    thumbnail: '/IMG_6514-2.jpg'
  }
];

export default function Digital() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, style } = useTheme();

  const filteredProjects = DIGITAL_PROJECTS.filter(project => 
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
      className={`max-w-6xl mx-auto w-full relative ${theme === 'dark' ? 'px-6 py-24' : 'px-8 py-28'}`}
    >
      <header className={`mb-12 relative z-10 ${theme === 'dark' ? '' : 'scrapbook-cutout'}`}>
        <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-4 ${theme === 'dark' ? 'text-neutral-100' : 'text-black'}`}>
           {style === '95' ? <DecryptedText text="Visual & Audio Media" /> : "Visual & Audio Media"}
        </h1>
      </header>
      {theme === 'light' && (
        <p className="font-mono text-black text-sm md:text-base leading-relaxed max-w-2xl bg-white border-2 border-black p-4 shadow-[4px_4px_0_#000] -rotate-1 mb-12 relative z-10 w-fit">
          {style === '95' ? (
            <DecryptedText 
              text="A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion." 
              speed={30}
            />
          ) : (
            "A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion."
          )}
        </p>
      )}
      {theme === 'dark' && (
        <p className="font-mono text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mb-12">
          {style === '95' ? (
            <DecryptedText 
              text="A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion." 
              speed={30}
            />
          ) : (
            "A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion."
          )}
        </p>
      )}

      <div className={`mb-12 relative max-w-4xl ${theme === 'dark' ? '' : 'win95-window'}`}>
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
            placeholder="Search media by skill or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pl-4">
        {filteredProjects.length > 0 ? filteredProjects.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`group flex flex-col gap-4 relative ${theme === 'dark' ? '' : 'scrapbook-element polaroid'}`}
          >
            {theme === 'light' && <div className="tape hidden sm:block"></div>}
            <Link to={`/project/${item.id}`} className={`relative aspect-[4/3] overflow-hidden flex items-center justify-center cursor-pointer ${theme === 'dark' ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-200 border-2 border-black shadow-[inset_2px_2px_0_rgba(0,0,0,0.5)]'}`}>
              <div className="absolute inset-0 bg-transparent dark:bg-black/20 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              {item.category === 'Video' || item.category === 'Audio' ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-black/80 dark:bg-white text-white dark:text-black flex items-center justify-center pl-1 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
              ) : null}
            </Link>
            
            <div className="flex flex-col">
              <div className={`flex items-center gap-3 mb-2 uppercase tracking-widest ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans font-bold text-[10px]'}`}>
                <span>{item.category}</span>
                <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-neutral-700' : 'bg-black'}`} />
                <span>{item.period}</span>
              </div>
              <Link to={`/project/${item.id}`} className={`transition-colors ${theme === 'dark' ? 'group-hover:text-white' : 'hover:bg-black hover:text-white w-fit px-1'}`}>
                <h3 className={`text-2xl font-medium mb-1 ${theme === 'dark' ? 'font-display text-neutral-200' : 'font-sans text-black font-bold'}`}>{item.title}</h3>
              </Link>
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'font-mono text-neutral-500' : 'font-sans text-[#808080]'}`}>{item.role}</p>
              <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-black font-serif italic'}`}>{item.description}</p>
              
              <Link to={`/project/${item.id}`} className={`mt-auto flex items-center gap-2 text-xs uppercase tracking-widest w-max mb-6 transition-colors ${theme === 'dark' ? 'font-mono text-neutral-500 hover:text-white' : 'font-sans text-black font-bold hover:!text-[#000080]'}`}>
                 Read details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>

              <ul className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <li key={tag}>
                    <div className={`px-2 py-1 text-xs uppercase tracking-wider ${theme === 'dark' ? 'bg-neutral-900 text-neutral-400 font-mono' : 'border border-black bg-white text-black shadow-[2px_2px_0_#000] font-sans font-bold'}`}>
                      {tag}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )) : (
          <div className={`md:col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>No media matching "{searchQuery}"</div>
        )}
      </div>
    </motion.div>
  );
}
