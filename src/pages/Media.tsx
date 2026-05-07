import { motion } from 'motion/react';
import { Play } from 'lucide-react';

const MEDIA_PROJECTS = [
  {
    id: 'digital-junk',
    category: 'Video',
    title: 'Digital Junk Collective',
    role: 'Director / Editor',
    period: '2023',
    description: 'Directed and edited a stylized short film exploring the aesthetic of digital degradation and artifacts. Managed color grading and VFX pipelines.',
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
    tags: ['Pro Tools', 'Logic Pro', 'Mixing', 'Mastering'],
    thumbnail: '/IMG_6514-2.jpg'
  }
];

export default function Media() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-24 w-full"
    >
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Visual & Audio Media</h1>
        <p className="font-mono text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
          A collection of creative works spanning videography, photography, and audio production. Exploring the intersection of digital artifacts and human emotion.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {MEDIA_PROJECTS.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col gap-4"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              {item.category === 'Video' || item.category === 'Audio' ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center pl-1 shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <Play className="w-6 h-6" />
                  </div>
                </div>
              ) : null}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-neutral-500">{item.category}</span>
                <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">{item.period}</span>
              </div>
              <h3 className="text-2xl font-casual font-medium text-neutral-200 mb-1 group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-sm font-mono text-neutral-500 mb-3">{item.role}</p>
              <p className="text-sm leading-relaxed text-neutral-400 mb-4">{item.description}</p>
              
              <ul className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <li key={tag}>
                    <div className="px-2 py-1 bg-neutral-900 text-neutral-400 text-xs font-mono uppercase tracking-wider">
                      {tag}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
