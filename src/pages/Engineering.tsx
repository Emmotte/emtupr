import { motion } from 'motion/react';

const ENGINEERING_PROJECTS = [
  {
    id: 'network',
    title: 'Enterprise Architecture & Routing',
    role: 'Senior Network Engineer',
    period: '2021 — Present',
    description: 'Designed and implemented scalable, high-availability enterprise networks. Specialized in BGP/OSPF routing, switching, and advanced firewall configuration to ensure zero-trust security compliance.',
    tags: ['Cisco', 'Juniper', 'Palo Alto', 'BGP', 'OSPF']
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure Setup',
    role: 'Systems Architect',
    period: '2018 — 2021',
    description: 'Deployed resilient cloud networking solutions across AWS and Azure. Automated infrastructure provisioning using Terraform and CI/CD pipelines, increasing deployment speed by 60%.',
    tags: ['AWS', 'Azure', 'Terraform', 'Python']
  },
  {
    id: 'nexus',
    title: 'Nexus UI Framework',
    role: 'Lead UX/UI Designer',
    period: '2022 — Present',
    description: 'Developed an open-source, accessible UI component library. Conducted extensive user research to refine interaction models, resulting in a minimalist and highly intuitive design system.',
    tags: ['Figma', 'React', 'Tailwind CSS', 'User Research']
  },
  {
    id: 'aura',
    title: 'Aura Analytics Dashboard',
    role: 'Product Designer',
    period: '2020 — 2022',
    description: 'Architected the core data visualization experience for a SaaS analytics tool. Translated complex data streams into elegant, digestible dashboards.',
    tags: ['Prototyping', 'Wireframing', 'D3.js']
  }
];

export default function Engineering() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-24 w-full"
    >
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Engineering & Design</h1>
        <p className="font-mono text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
          Bridging the gap between robust network infrastructure and intuitive product design. Building systems that are reliable at the core and elegant at the surface.
        </p>
      </header>

      <div className="space-y-16">
        {ENGINEERING_PROJECTS.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative grid pb-1 sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 transition-opacity border-l border-neutral-800 pl-6"
          >
            <div className="absolute w-2 h-2 bg-neutral-800 rounded-full -left-[4.5px] top-2 transition-colors duration-300 group-hover:bg-neutral-400" />
            
            <header className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:col-span-2 font-mono">
              {item.period}
            </header>
            
            <div className="z-10 sm:col-span-6">
              <h3 className="font-medium leading-snug text-neutral-200 text-xl font-casual">
                {item.title}
              </h3>
              <div className="text-sm text-neutral-500 mt-1 font-mono">{item.role}</div>

              <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                {item.tags.map(tag => (
                  <li key={tag}>
                    <div className="flex items-center rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-xs font-medium leading-5 text-neutral-300 font-mono">
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
