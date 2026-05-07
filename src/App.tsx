import { motion } from 'motion/react';
import ParticleBackground from './components/ParticleBackground';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';

const EXPERIENCES = [
  {
    id: 'network',
    category: 'Network Engineering',
    items: [
      {
        title: 'Enterprise Architecture & Routing',
        role: 'Senior Network Engineer',
        period: '2021 — Present',
        description: 'Designed and implemented scalable, high-availability enterprise networks. Specialized in BGP/OSPF routing, switching, and advanced firewall configuration to ensure zero-trust security compliance.',
        tags: ['Cisco', 'Juniper', 'Palo Alto', 'BGP', 'OSPF']
      },
      {
        title: 'Cloud Infrastructure Setup',
        role: 'Systems Architect',
        period: '2018 — 2021',
        description: 'Deployed resilient cloud networking solutions across AWS and Azure. Automated infrastructure provisioning using Terraform and CI/CD pipelines, increasing deployment speed by 60%.',
        tags: ['AWS', 'Azure', 'Terraform', 'Python']
      }
    ]
  },
  {
    id: 'product-design',
    category: 'Product Design',
    items: [
      {
        title: 'Nexus UI Framework',
        role: 'Lead UX/UI Designer',
        period: '2022 — Present',
        description: 'Developed an open-source, accessible UI component library. Conducted extensive user research to refine interaction models, resulting in a minimalist and highly intuitive design system.',
        tags: ['Figma', 'React', 'Tailwind CSS', 'User Research']
      },
      {
        title: 'Aura Analytics Dashboard',
        role: 'Product Designer',
        period: '2020 — 2022',
        description: 'Architected the core data visualization experience for a SaaS analytics tool. Translated complex data streams into elegant, digestible dashboards.',
        tags: ['Prototyping', 'Wireframing', 'D3.js']
      }
    ]
  },
  {
    id: 'audio',
    category: 'Audio Production & Mixing',
    items: [
      {
        title: 'Live Electronic Performances',
        role: 'Performer & Sound Designer',
        period: '2019 — Present',
        description: 'Crafted improvisational live sets blending hip-hop beats with generative electronic soundscapes. Utilized analog synthesizers and custom software patches.',
        tags: ['Ableton Live', 'Max/MSP', 'Sound Design']
      },
      {
        title: 'Studio Mixing & Mastering',
        role: 'Audio Engineer',
        period: '2017 — Present',
        description: 'Delivered professional mixing and mastering for independent artists. Focused on achieving pristine clarity and dynamic range across multiple genres.',
        tags: ['Pro Tools', 'Logic Pro', 'Mixing', 'Mastering']
      }
    ]
  },
  {
    id: 'visuals',
    category: 'Videography & Photography',
    items: [
      {
        title: 'Digital Junk Collective',
        role: 'Director / Editor',
        period: '2023',
        description: 'Directed and edited a stylized short film exploring the aesthetic of digital degradation and artifacts. Managed color grading and VFX pipelines.',
        tags: ['Premiere Pro', 'After Effects', 'Color Grading']
      },
      {
        title: 'Urban Spaces & People',
        role: 'Photographer',
        period: '2016 — Present',
        description: 'Ongoing photographic series documenting the intersection of modern architecture and human interaction. Exhibited in local galleries.',
        tags: ['Portraiture', 'Street Photography', 'Lightroom']
      }
    ]
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-neutral-800 selection:text-white">
      <ParticleBackground />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 xl:px-32 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-8">
          
          {/* Left Sticky Header */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24 relative z-10 w-full mb-12 lg:mb-0">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl"
              >
                Emmett Tupper
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="mt-3 text-lg font-medium tracking-tight text-neutral-300 sm:text-xl"
              >
                Network Engineer & Creative Technologist
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="mt-4 max-w-md leading-relaxed text-neutral-400 text-sm md:text-base font-mono"
              >
                Bridging the gap between robust network infrastructure, intuitive product design, and high-fidelity media production.
              </motion.p>

              <motion.nav 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="nav hidden lg:block mt-24"
              >
                <ul className="w-max">
                  {EXPERIENCES.map((section, i) => (
                    <li key={section.id} className="mb-4">
                      <a className="group flex items-center py-3" href={`#${section.id}`}>
                        <span className="nav-indicator mr-4 h-px w-8 bg-neutral-600 transition-all group-hover:w-16 group-hover:bg-neutral-200"></span>
                        <span className="nav-text text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-200">
                          {section.category}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            </div>

            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 flex items-center text-neutral-400 gap-6"
            >
              <li>
                <a href="mailto:emmetttupper1@gmail.com" className="hover:text-white transition-colors p-2 -m-2">
                  <span className="sr-only">Email</span>
                  <Mail className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors p-2 -m-2">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors p-2 -m-2">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
              </li>
            </motion.ul>
          </header>

          {/* Right Scrolling Content */}
          <main id="content" className="pt-12 lg:w-[50%] lg:py-24 relative z-10 w-full">
            {EXPERIENCES.map((section, idx) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                id={section.id}
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-32 lg:scroll-mt-24"
              >
                <div className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-[#050505]/95 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-200">
                    {section.category}
                  </h2>
                </div>
                
                <div className="lg:hidden mb-6">
                   <h2 className="text-xl font-bold tracking-tight text-white">{section.category}</h2>
                </div>

                <ol className="group/list">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="mb-12 border-l border-neutral-800 pl-6 relative">
                      <div className="absolute w-2 h-2 bg-neutral-800 rounded-full -left-[4.5px] top-2 transition-colors duration-300 hover:bg-neutral-400 group-hover/list:bg-neutral-600" />
                      
                      <div className="group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 transition-opacity">
                        <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:col-span-2 font-mono">
                          {item.period}
                        </header>
                        
                        <div className="z-10 sm:col-span-6">
                          <h3 className="font-medium leading-snug text-neutral-200">
                            <div>
                              <div className="inline-flex items-baseline font-medium leading-tight text-neutral-200 hover:text-white focus-visible:text-white group/link text-base">
                                <span>{item.title}</span>
                              </div>
                            </div>
                            <div className="text-sm text-neutral-500 mt-1">{item.role}</div>
                          </h3>
                          <p className="mt-4 text-sm leading-normal text-neutral-400">
                            {item.description}
                          </p>
                          <ul className="mt-4 flex flex-wrap" aria-label="Tags">
                            {item.tags.map(tag => (
                              <li key={tag} className="mr-1.5 mt-2">
                                <div className="flex items-center rounded-full bg-neutral-900/50 border border-neutral-800 px-3 py-1 text-xs font-medium leading-5 text-neutral-300">
                                  {tag}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.section>
            ))}

            <motion.footer 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-md pb-16 text-sm text-neutral-600 sm:pb-0 font-mono"
            >
              <p>
                Crafted with an emphasis on minimalist design. <br/>
                Built with <span className="text-neutral-400">React</span>, <span className="text-neutral-400">Tailwind CSS</span>, and <span className="text-neutral-400">Motion</span>.
              </p>
            </motion.footer>

          </main>
        </div>
      </div>
    </div>
  );
}

