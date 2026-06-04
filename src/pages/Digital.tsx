import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import TextType from '../components/TextType';
import DecryptedText from '../components/DecryptedText';

// Kept for ProjectDetail.tsx fallback — Firestore is now the primary source
export const DIGITAL_PROJECTS: any[] = [];

const DIGITAL_CATEGORIES = ['Photography', 'Video', 'Audio'];


export default function Digital() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, style } = useTheme();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('isPublic', '==', true),
      where('category', 'in', DIGITAL_CATEGORIES),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error('Digital Firestore error:', err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(project =>
    searchQuery === '' ? true :
    (project.skills || project.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
        {loading ? (
          <div className={`md:col-span-2 font-mono text-sm animate-pulse ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>Loading media...</div>
        ) : filteredProjects.length > 0 ? filteredProjects.map((item, idx) => (
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
                {(item.skills || item.tags || []).map((tag: string) => (
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
          <div className={`md:col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080]'}`}>
            {searchQuery ? `No media matching "${searchQuery}"` : 'No media published yet.'}
          </div>
        )}
      </div>
    </motion.div>
  );
}
