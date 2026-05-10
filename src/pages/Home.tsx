import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import TextType from '../components/TextType';
import DecryptedText from '../components/DecryptedText';
import { ArrowRight, Search, Mail, Send } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ENGINEERING_PROJECTS } from './Engineering';
import { MEDIA_PROJECTS } from './Media';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

interface Project {
  id: string;
  title: string;
  category: string;
  isPublic: boolean;
  link?: string;
}

export default function Home() {
  const { theme, style } = useTheme();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const roles = ["Network Engineer", "Product Designer", "Audiovisual Artist"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (style !== '95') return;
    
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [style]);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setFormStatus('sending');
    const formData = new FormData(formRef.current);
    formData.append("access_key", "6cf7d2ad-2e75-4b87-b384-a8da2873f1cf");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus('sent');
        formRef.current?.reset();
      } else {
        setFormStatus('error');
      }
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  const allLocalProjects = [...ENGINEERING_PROJECTS, ...MEDIA_PROJECTS];
  const filteredProjects = allLocalProjects.filter(project => 
    searchQuery === '' ? false : 
    (project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    project.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setRecentProjects(projectsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col relative"
    >
      <div 
        className={`relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-6 perspective-[1200px] ${theme === 'light' ? 'pt-32' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="flex flex-col items-center justify-center pointer-events-none pt-12 relative"
        >
          {theme === 'light' && (
            <>
              {/* Decorative light mode elements */}
              <div className="absolute -top-16 -left-16 pointer-events-none rotate-12 drop-shadow-xl z-0">
                <img src="https://win98icons.alexmeub.com/icons/png/world-1.png" className="w-24 h-24" style={{ imageRendering: 'pixelated' }} alt="globe" />
              </div>
              <div className="absolute -bottom-16 -right-12 pointer-events-none -rotate-12 drop-shadow-xl z-0">
                <img src="https://win98icons.alexmeub.com/icons/png/cd_drive-0.png" className="w-24 h-24" style={{ imageRendering: 'pixelated' }} alt="cd drive" />
              </div>
              <div className="absolute top-1/2 -right-32 pointer-events-none rotate-6 drop-shadow-xl z-0 hidden md:block">
                <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" className="w-24 h-24" style={{ imageRendering: 'pixelated' }} alt="computer" />
              </div>
            </>
          )}

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-8xl font-bold tracking-tighter text-center transition-all duration-300 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-heading text-white' : theme === 'dark' ? 'font-display text-white' : 'scrapbook-cutout !text-black'}`}
            style={{ translateZ: 50 }}
          >
            {style === '95' ? (
              <TextType text="emtupr works." delay={300} cursor={theme === 'light'} />
            ) : (
              <DecryptedText text="emtupr works." animateOn="view" speed={100} />
            )}
          </motion.h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mt-6 text-lg md:text-xl max-w-2xl text-center transition-all duration-300 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-subheading text-[#888]' : theme === 'dark' ? 'font-mono text-neutral-400' : 'scrapbook-cutout-alt text-lg'}`}
            style={{ translateZ: 30 }}
          >
            <div className="flex items-center justify-center min-h-[1.5em]">
              <DecryptedText 
                key={style === '95' ? roleIndex : 'recursive'}
                text={style === '95' ? roles[roleIndex] : "Network Engineer / Product Designer / Audiovisual Artist"} 
                animateOn="view"
                revealDirection="center"
                speed={40}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-6 text-sm tracking-wide pointer-events-auto ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono' : theme === 'dark' ? 'font-mono uppercase' : 'font-sans font-bold text-gray-800'}`}
        >
          <Link to="/engineering" className={`group flex items-center justify-center gap-3 px-8 py-5 transition-all w-full sm:w-[280px] ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-border vulfpeck-bg hover:bg-[#1a1a1a] text-white' : theme === 'dark' ? 'border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-200 uppercase hover:pr-4' : 'bg-white text-gray-700 hover:text-black hover:border-gray-300 hover:shadow-md uppercase tracking-[0.2em] shadow-sm border border-gray-200 flex-col'}`}>
            {style === '95' ? <DecryptedText text="Engineering & Design" /> : "Engineering & Design"}
            {theme === 'dark' && style !== 'recursive' && <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />}
          </Link>
          <Link to="/media" className={`group flex items-center justify-center gap-3 px-8 py-5 transition-all w-full sm:w-[280px] ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-border vulfpeck-bg hover:bg-[#1a1a1a] text-white' : theme === 'dark' ? 'border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-200 uppercase hover:pr-4' : 'bg-white text-gray-700 hover:text-black hover:border-gray-300 hover:shadow-md uppercase tracking-[0.2em] shadow-sm border border-gray-200 flex-col'}`}>
            {style === '95' ? <DecryptedText text="Visual & Audio Media" /> : "Visual & Audio Media"}
            {theme === 'dark' && style !== 'recursive' && <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />}
          </Link>
        </motion.div>

        {/* Search and Recent database additions display */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className={`mt-16 w-full max-w-sm font-mono text-sm pointer-events-auto ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono' : theme === 'dark' ? 'opacity-80' : 'win95-window'}`}
        >
          {theme === 'light' && (
            <div className="win95-titlebar mb-1">
              <span>explorer.exe</span>
              <div className="flex gap-1">
                <div className="win95-titlebar-btn">_</div>
                <div className="win95-titlebar-btn">□</div>
                <div className="win95-titlebar-btn">X</div>
              </div>
            </div>
          )}

          <div className={`${theme === 'light' ? 'win95-body' : ''}`}>
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-800'}`} />
              </div>
              <input
                type="text"
                placeholder="Search by skill or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none transition-colors ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-bg vulfpeck-border text-white vulfpeck-mono focus:border-[#666]' : theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
              />
            </div>

             <div className={`flex items-center justify-between mb-4 flex-none uppercase tracking-widest text-xs border-b pb-2 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted vulfpeck-border' : theme === 'dark' ? 'text-neutral-500 border-neutral-800' : 'text-black border-[#808080] font-bold'}`}>
               <span>{searchQuery ? 'Search Results' : 'Recent Additions'}</span>
               {!searchQuery && <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' && style === 'recursive' ? 'bg-[#888]' : theme === 'dark' ? 'bg-neutral-400' : 'bg-[#000080]'}`}></span>}
            </div>
            
            <div className="flex flex-col gap-3 min-h-[60px]">
              {searchQuery ? (
                filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <Link
                      to={`/project/${project.id}`}
                      key={project.id}
                      className={`flex justify-between items-center group/project transition-transform ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono hover:translate-x-1' : theme === 'dark' ? 'hover:translate-x-1' : 'hover:bg-[#000080] hover:text-white px-2 py-1'}`}
                    >
                      <span className={`transition-colors ${theme === 'dark' && style === 'recursive' ? 'text-[#ccc] group-hover/project:text-white' : theme === 'dark' ? 'text-neutral-300 group-hover/project:text-white' : 'text-black group-hover/project:text-white font-sans'}`}>{project.title}</span>
                      <span className={`text-xs ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted' : theme === 'dark' ? 'text-neutral-600' : 'text-[#808080] group-hover/project:text-[#c0c0c0] font-sans'}`}>{project.category}</span>
                    </Link>
                  ))
                ) : (
                  <div className={`italic ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted vulfpeck-mono' : theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>No projects found.</div>
                )
              ) : (
                loading ? (
                   <div className={`italic ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted vulfpeck-mono' : theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>Connecting to database...</div>
                ) : recentProjects.length > 0 ? (
                   recentProjects.map(project => (
                     <Link
                       to={`/project/${project.id}`}
                       key={project.id}
                       className={`flex justify-between items-center group/project transition-transform ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono hover:translate-x-1' : theme === 'dark' ? 'hover:translate-x-1' : 'hover:bg-[#000080] hover:text-white px-2 py-1'}`}
                     >
                       <span className={`transition-colors ${theme === 'dark' && style === 'recursive' ? 'text-[#ccc] group-hover/project:text-white' : theme === 'dark' ? 'text-neutral-300 group-hover/project:text-white' : 'text-black group-hover/project:text-white font-sans'}`}>{project.title}</span>
                       <span className={`text-xs ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted' : theme === 'dark' ? 'text-neutral-600' : 'text-[#808080] group-hover/project:text-[#c0c0c0] font-sans'}`}>{project.category}</span>
                     </Link>
                   ))
                ) : (
                   <div className={`italic ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted vulfpeck-mono' : theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>No recent public updates.</div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`relative z-10 w-full max-w-4xl mx-auto mt-12 mb-12 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-border vulfpeck-bg px-8 md:px-14 py-16' : theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-white px-8 md:px-14 py-16 shadow-lg rounded-none' : 'win95-window backdrop-blur-sm'}`}>
        {theme === 'light' && (
          <div className="win95-titlebar mb-2">
            <span>notepad.exe - about_me.txt</span>
            <div className="flex gap-1">
              <div className="win95-titlebar-btn">_</div>
              <div className="win95-titlebar-btn">□</div>
              <div className="win95-titlebar-btn">X</div>
            </div>
          </div>
        )}
        <div className={`${theme === 'light' ? 'win95-body' : ''} flex flex-col gap-8 md:flex-row md:items-start justify-between`}>
          <div className="flex-none">
            <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-2 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-heading text-white' : theme === 'dark' ? 'font-sans text-white leading-tight' : 'font-sans text-black font-bold'}`}>
              {style === '95' ? <DecryptedText text="About Me" /> : "About Me"}
            </h2>
            <p className={`text-xs uppercase tracking-widest font-bold ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono vulfpeck-muted' : theme === 'dark' ? 'font-sans text-neutral-500' : 'font-sans text-[#808080]'}`}>Background & Philosophy</p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex-1 max-w-2xl text-base md:text-xl font-medium leading-relaxed space-y-6 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-text text-[#ccc]' : theme === 'dark' ? 'text-neutral-300' : 'text-black font-sans bg-white border border-[#c0c0c0] p-4 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]'}`}
          >
            <p>
              <span className={`${theme === 'dark' && style === 'recursive' ? 'vulfpeck-accent' : theme === 'dark' ? 'text-white' : ''}`}>Hello, I'm Emmett.</span> I specialize in crafting seamless digital experiences at the intersection of robust network engineering, minimalist product design, and high-fidelity media production. Whether routing enterprise networks or editing digital films, my focus is always on usability and performance.
            </p>
            <p className={`${theme === 'dark' && style === 'recursive' ? 'vulfpeck-muted' : theme === 'dark' ? 'text-neutral-400' : ''}`}>
              The digital space shouldn't be noisy. I aim to create architectures—both literal networks and conceptual digital products—that empower users without demanding attention.
            </p>
            <p className={`text-sm pl-4 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-text italic vulfpeck-muted border-l-2 vulfpeck-border' : theme === 'dark' ? 'font-sans italic text-neutral-500 border-l-2 border-neutral-800' : 'font-serif italic text-black border-l-2 border-black'}`}>
              "The best infrastructure is invisible."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="relative w-full max-w-4xl mx-auto mt-12 mb-24">
        <div className={`relative z-10 w-full h-full ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-border vulfpeck-bg px-8 md:px-14 py-16' : theme === 'dark' ? 'rounded-none overflow-hidden px-8 md:px-14 py-16 bg-[#0a0a0a] border border-neutral-800 text-white shadow-lg' : 'win95-window backdrop-blur-sm'}`}>
          {theme === 'light' && (
            <div className="win95-titlebar mb-2">
              <span>email_client.exe - Contact</span>
              <div className="flex gap-1">
                <div className="win95-titlebar-btn">_</div>
                <div className="win95-titlebar-btn">□</div>
                <div className="win95-titlebar-btn">X</div>
              </div>
            </div>
          )}
          <div className={`${theme === 'light' ? 'win95-body' : ''} relative z-10 flex flex-col gap-8 md:flex-row md:items-start justify-between text-left`}>
            <div className="flex-none md:w-1/3">
              <h2 className={`text-4xl md:text-6xl font-black tracking-tighter mb-2 ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-heading text-white' : theme === 'dark' ? 'font-sans text-white leading-[0.9]' : 'font-sans text-black'}`}>
                {style === '95' ? (
                  <>Get in <br className="hidden md:block" /> <DecryptedText text="Touch" /></>
                ) : (
                  <>Get in <br className="hidden md:block" />Touch</>
                )}
              </h2>
              <p className={`text-xs uppercase tracking-widest leading-relaxed mt-6 font-bold ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-text vulfpeck-muted' : theme === 'dark' ? 'font-sans text-neutral-400' : 'font-sans text-[#808080]'}`}>
                Interested in collaborating or just want to say hi? Send me a message below.
              </p>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex-1 w-full ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-bg-light vulfpeck-border p-8' : theme === 'dark' ? 'bg-neutral-900/50 border border-neutral-800 p-8 shadow-sm' : 'p-4 bg-[#c0c0c0] border-2 border-b-white border-r-white border-t-black border-l-black shadow-[inset_1px_1px_0_#808080]'}`}
            >
              <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className={`text-xs uppercase tracking-widest font-bold ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono vulfpeck-muted' : theme === 'dark' ? 'font-sans text-neutral-500' : 'font-sans text-black'}`}>Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className={`w-full text-base px-4 py-3 focus:outline-none transition-colors ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-bg vulfpeck-border text-white vulfpeck-mono focus:border-[#666]' : theme === 'dark' ? 'rounded-none bg-neutral-900 border border-neutral-800 text-white font-sans focus:border-neutral-600' : 'rounded-none bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={`text-xs uppercase tracking-widest font-bold ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono vulfpeck-muted' : theme === 'dark' ? 'font-sans text-neutral-500' : 'font-sans text-black'}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your Email"
                    className={`w-full text-base px-4 py-3 focus:outline-none transition-colors ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-bg vulfpeck-border text-white vulfpeck-mono focus:border-[#666]' : theme === 'dark' ? 'rounded-none bg-neutral-900 border border-neutral-800 text-white font-sans focus:border-neutral-600' : 'rounded-none bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                  />
                </div>
                <input type="hidden" name="to_email" value="emmetttupper1@gmail.com" />
                <div className="flex flex-col gap-1">
                  <label className={`text-xs uppercase tracking-widest font-bold ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-mono vulfpeck-muted' : theme === 'dark' ? 'font-sans text-neutral-500' : 'font-sans text-black'}`}>Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Your message..."
                    className={`w-full text-base px-4 py-3 focus:outline-none transition-colors resize-none ${theme === 'dark' && style === 'recursive' ? 'vulfpeck-bg vulfpeck-border text-white vulfpeck-mono focus:border-[#666]' : theme === 'dark' ? 'rounded-none bg-neutral-900 border border-neutral-800 text-white font-sans focus:border-neutral-600' : 'rounded-none bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending' || formStatus === 'sent'}
                  className={`mt-4 flex items-center justify-center gap-2 py-4 px-8 text-sm uppercase tracking-widest font-bold transition-all ${
                    theme === 'dark' && style === 'recursive'
                    ? 'bg-white text-black hover:bg-[#ccc] w-full disabled:opacity-50'
                    : theme === 'dark'
                    ? 'bg-white text-black hover:bg-neutral-200 rounded-none w-full disabled:opacity-50'
                    : 'bg-[#c0c0c0] text-black border-2 border-b-black border-r-black border-t-white border-l-white hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black hover:active:bg-[#d0d0d0] disabled:opacity-50'
                  }`}
                >
                  {formStatus === 'idle' && <><Send className="w-4 h-4" /> Send Message</>}
                  {formStatus === 'sending' && 'Sending...'}
                  {formStatus === 'sent' && 'Message Sent!'}
                  {formStatus === 'error' && 'Error. Try Again.'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
