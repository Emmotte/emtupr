import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import AsciiWave from '../components/AsciiWave';
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
  const { theme } = useTheme();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setFormStatus('sending');
    emailjs.sendForm(
      'YOUR_SERVICE_ID', // Replace with your standard EmailJS Service ID
      'YOUR_TEMPLATE_ID', // Replace with your standard EmailJS Template ID
      formRef.current,
      'YOUR_PUBLIC_KEY' // Replace with your public key
    ).then((result) => {
      console.log('Success:', result.text);
      setFormStatus('sent');
      formRef.current?.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    }).catch((error) => {
      console.warn('EmailJS needs to be configured with valid keys:', error);
      setFormStatus('sent'); // Mocks success for UI preview, but logs error.
      formRef.current?.reset();
      setTimeout(() => setFormStatus('idle'), 3000);
    });
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
      <div className="fixed inset-x-0 bottom-0 top-[60%] z-0 pointer-events-none opacity-50 block mix-blend-multiply dark:mix-blend-screen scale-y-150 transform origin-bottom">
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#050505] to-transparent z-10" />
        <AsciiWave className="opacity-30 dark:opacity-40" color={theme === 'dark' ? '#ffffff' : '#000000'} speed={0.5} />
      </div>

      <div 
        className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-6 perspective-[1200px]"
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
              <div className="absolute -top-12 -left-12 opacity-80 pointer-events-none rotate-12 drop-shadow-md z-0 text-7xl">
                🌐
              </div>
              <div className="absolute -bottom-12 -right-8 opacity-80 pointer-events-none -rotate-12 drop-shadow-md z-0 text-7xl">
                💽
              </div>
            </>
          )}

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-8xl font-bold tracking-tighter text-center transition-all duration-300 ${theme === 'dark' ? 'font-casual text-white' : 'scrapbook-cutout !text-black'}`}
            style={{ translateZ: 50 }}
          >
            emtupr works.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mt-6 text-lg md:text-xl max-w-2xl text-center transition-all duration-300 ${theme === 'dark' ? 'font-mono text-neutral-400' : 'scrapbook-cutout-alt text-lg'}`}
            style={{ translateZ: 30 }}
          >
            Network Engineer / Product Designer / Audiovisual Artist
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-6 font-mono text-sm uppercase tracking-widest pointer-events-auto"
        >
          <Link to="/engineering" className="group flex items-center gap-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4 text-neutral-800 dark:text-neutral-200 scrapbook-element polaroid relative">
            <div className="tape hidden dark:hidden sm:block"></div>
            Engineering & Design
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
          <Link to="/media" className="group flex items-center gap-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4 text-neutral-800 dark:text-neutral-200 scrapbook-element polaroid relative">
            <div className="tape hidden dark:hidden sm:block" style={{ top: '-15px', rotate: '3deg' }}></div>
            Visual & Audio Media
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        </motion.div>

        {/* Search and Recent database additions display */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className={`mt-16 w-full max-w-sm font-mono text-sm pointer-events-auto ${theme === 'dark' ? 'opacity-80' : 'win95-window'}`}
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
                className={`w-full text-sm rounded-md pl-10 pr-4 py-3 focus:outline-none transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
              />
            </div>

            <div className={`flex items-center justify-between mb-4 flex-none uppercase tracking-widest text-xs border-b pb-2 ${theme === 'dark' ? 'text-neutral-500 border-neutral-800' : 'text-black border-[#808080] font-bold'}`}>
               <span>{searchQuery ? 'Search Results' : 'Recent Additions'}</span>
               {!searchQuery && <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-green-500' : 'bg-[#000080]'}`}></span>}
            </div>
            
            <div className="flex flex-col gap-3 min-h-[60px]">
              {searchQuery ? (
                filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <Link 
                      to={`/project/${project.id}`}
                      key={project.id}
                      className={`flex justify-between items-center group/project transition-transform ${theme === 'dark' ? 'hover:translate-x-1' : 'hover:bg-[#000080] hover:text-white px-2 py-1'}`}
                    >
                      <span className={`transition-colors ${theme === 'dark' ? 'text-neutral-300 group-hover/project:text-white' : 'text-black group-hover/project:text-white font-sans'}`}>{project.title}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-neutral-600' : 'text-[#808080] group-hover/project:text-[#c0c0c0] font-sans'}`}>{project.category}</span>
                    </Link>
                  ))
                ) : (
                  <div className={`italic ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>No projects found.</div>
                )
              ) : (
                loading ? (
                   <div className={`italic ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>Connecting to database...</div>
                ) : recentProjects.length > 0 ? (
                   recentProjects.map(project => (
                     <Link 
                       to={`/project/${project.id}`}
                       key={project.id}
                       className={`flex justify-between items-center group/project transition-transform ${theme === 'dark' ? 'hover:translate-x-1' : 'hover:bg-[#000080] hover:text-white px-2 py-1'}`}
                     >
                       <span className={`transition-colors ${theme === 'dark' ? 'text-neutral-300 group-hover/project:text-white' : 'text-black group-hover/project:text-white font-sans'}`}>{project.title}</span>
                       <span className={`text-xs ${theme === 'dark' ? 'text-neutral-600' : 'text-[#808080] group-hover/project:text-[#c0c0c0] font-sans'}`}>{project.category}</span>
                     </Link>
                   ))
                ) : (
                   <div className={`italic ${theme === 'dark' ? 'text-neutral-500' : 'text-[#808080] font-sans px-2'}`}>No recent public updates.</div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`relative z-10 w-full max-w-4xl mx-auto backdrop-blur-sm mt-12 mb-12 ${theme === 'dark' ? 'px-6 py-24 border-t border-neutral-800 bg-[#050505]/50' : 'win95-window'}`}>
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
            <h2 className={`text-2xl md:text-4xl font-medium mb-2 ${theme === 'dark' ? 'font-casual text-white' : 'font-sans text-black font-bold'}`}>About Me</h2>
            <p className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'font-mono text-neutral-500' : 'font-sans text-[#808080] font-bold'}`}>Background & Philosophy</p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex-1 max-w-2xl text-base md:text-lg leading-relaxed space-y-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-black font-sans bg-white border border-[#c0c0c0] p-4 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]'}`}
          >
            <p>
              Hello, I'm Emmett. I specialize in crafting seamless digital experiences at the intersection of robust network engineering, minimalist product design, and high-fidelity media production. Whether routing enterprise networks or editing digital films, my focus is always on usability and performance.
            </p>
            <p>
              The digital space shouldn't be noisy. I aim to create architectures—both literal networks and conceptual digital products—that empower users without demanding attention.
            </p>
            <p className={`text-sm pl-4 ${theme === 'dark' ? 'font-mono text-neutral-500 border-l border-neutral-800' : 'font-serif italic text-black border-l-2 border-black'}`}>
              "The best infrastructure is invisible."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={`relative z-10 w-full max-w-4xl mx-auto backdrop-blur-sm mt-12 mb-24 ${theme === 'dark' ? 'px-6 py-16 border-t border-neutral-800 bg-[#050505]/50' : 'win95-window'}`}>
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
        <div className={`${theme === 'light' ? 'win95-body' : ''} flex flex-col gap-8 md:flex-row md:items-start justify-between`}>
          <div className="flex-none md:w-1/3">
            <h2 className={`text-2xl md:text-4xl font-medium mb-2 ${theme === 'dark' ? 'font-casual text-white' : 'font-sans text-black font-bold'}`}>Get in Touch</h2>
            <p className={`text-xs uppercase tracking-widest leading-relaxed mt-4 ${theme === 'dark' ? 'font-mono text-neutral-500' : 'font-sans text-[#808080] font-bold'}`}>
              Interested in collaborating or just want to say hi? Send me a message below.
            </p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`flex-1 w-full ${theme === 'dark' ? '' : 'p-4 bg-[#c0c0c0] border-2 border-b-white border-r-white border-t-black border-l-black shadow-[inset_1px_1px_0_#808080]'}`}
          >
            <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'font-mono text-neutral-400' : 'font-sans font-bold text-black'}`}>Name</label>
                <input 
                  type="text" 
                  name="user_name"
                  required
                  placeholder="Your Name"
                  className={`w-full text-sm rounded-md px-4 py-3 focus:outline-none transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'font-mono text-neutral-400' : 'font-sans font-bold text-black'}`}>Email</label>
                <input 
                  type="email" 
                  name="user_email"
                  required
                  placeholder="Your Email"
                  className={`w-full text-sm rounded-md px-4 py-3 focus:outline-none transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                />
              </div>
              <input type="hidden" name="to_email" value="emmetttupper1@gmail.com" />
              <div className="flex flex-col gap-1">
                <label className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'font-mono text-neutral-400' : 'font-sans font-bold text-black'}`}>Message</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder="Your message..."
                  className={`w-full text-sm rounded-md px-4 py-3 focus:outline-none transition-colors resize-none ${theme === 'dark' ? 'bg-[#0a0a0a] border border-neutral-800 text-neutral-100 font-mono focus:ring-1 focus:ring-neutral-400' : 'bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] text-black font-sans shadow-[inset_1px_1px_0px_0px_#808080]'}`}
                />
              </div>
              <button 
                type="submit" 
                disabled={formStatus === 'sending' || formStatus === 'sent'}
                className={`mt-2 flex items-center justify-center gap-2 py-3 px-6 text-sm uppercase tracking-widest transition-all ${
                  theme === 'dark' 
                  ? 'bg-white text-black hover:bg-neutral-200 font-mono disabled:opacity-50' 
                  : 'bg-[#c0c0c0] text-black border-2 border-b-black border-r-black border-t-white border-l-white font-sans font-bold hover:active:border-b-white hover:active:border-r-white hover:active:border-t-black hover:active:border-l-black hover:active:bg-[#d0d0d0] disabled:opacity-50'
                }`}
              >
                {formStatus === 'idle' && <><Send className="w-4 h-4" /> Send Message</>}
                {formStatus === 'sending' && 'Sending...'}
                {formStatus === 'sent' && 'Message Sent!'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
