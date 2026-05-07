import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import AsciiWave from '../components/AsciiWave';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

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
          className="flex flex-col items-center justify-center pointer-events-none pt-12"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-center font-casual text-neutral-900 dark:text-white"
            style={{ translateZ: 50 }}
          >
            emtupr works.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl font-mono text-neutral-600 dark:text-neutral-400 max-w-2xl text-center"
            style={{ translateZ: 30 }}
          >
            Network Engineer / Product Designer / Audiovisual Artist
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-6 font-mono text-sm uppercase tracking-widest pointer-events-auto"
        >
          <Link to="/engineering" className="group flex items-center gap-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4 text-neutral-800 dark:text-neutral-200">
            Engineering & Design
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
          <Link to="/media" className="group flex items-center gap-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4 text-neutral-800 dark:text-neutral-200">
            Visual & Audio Media
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        </motion.div>

        {/* Recent database additions display */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="mt-16 w-full max-w-sm font-mono text-sm pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-4 text-neutral-500 flex-none uppercase tracking-widest text-xs border-b border-neutral-300 dark:border-neutral-800 pb-2">
             <span>Recent Additions</span>
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          
          <div className="flex flex-col gap-3 min-h-[60px]">
            {loading ? (
               <div className="text-neutral-500 italic">Connecting to database...</div>
            ) : recentProjects.length > 0 ? (
               recentProjects.map(project => (
                 <motion.a 
                   href={project.link || "#"}
                   key={project.id}
                   whileHover={{ x: 5 }}
                   className="flex justify-between items-center group/project"
                 >
                   <span className="text-neutral-700 dark:text-neutral-300 group-hover/project:text-black dark:group-hover/project:text-white transition-colors">{project.title}</span>
                   <span className="text-neutral-500 dark:text-neutral-600 text-xs">{project.category}</span>
                 </motion.a>
               ))
            ) : (
               <div className="text-neutral-500 italic">No recent public updates.</div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-[#050505]/50 backdrop-blur-sm">
        <div className="flex flex-col gap-8 md:flex-row md:items-start justify-between">
          <div className="flex-none">
            <h2 className="text-2xl md:text-4xl font-casual font-medium text-neutral-900 dark:text-white mb-2">About Me</h2>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">Background & Philosophy</p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-6"
          >
            <p>
              Hello, I'm Emmett. I specialize in crafting seamless digital experiences at the intersection of robust network engineering, minimalist product design, and high-fidelity media production. Whether routing enterprise networks or editing digital films, my focus is always on usability and performance.
            </p>
            <p>
              The digital space shouldn't be noisy. I aim to create architectures—both literal networks and conceptual digital products—that empower users without demanding attention.
            </p>
            <p className="font-mono text-sm text-neutral-500 border-l border-neutral-300 dark:border-neutral-800 pl-4">
              "The best infrastructure is invisible."
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
