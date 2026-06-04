import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTheme } from '../components/ThemeProvider';
import DecryptedText from '../components/DecryptedText';
import { PHYSICAL_PROJECTS } from './Physical';
import { DIGITAL_PROJECTS } from './Digital';

interface Project {
  title: string;
  category: string;
  description: string;
  content: string;
  skills?: string[];
  tags?: string[];
  period?: string;
  role?: string;
  thumbnail?: string;
  link?: string;
  createdAt?: any;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, style } = useTheme();

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isPublic) {
          setProject(docSnap.data() as Project);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Firebase document not found or error, falling back to local data', error);
      }
      
      // Fallback to local data
      const localPhysical = PHYSICAL_PROJECTS.find(p => p.id === id);
      if (localPhysical) {
        setProject(localPhysical);
        setLoading(false);
        return;
      }

      const localDigital = DIGITAL_PROJECTS.find(p => p.id === id);
      if (localDigital) {
        setProject(localDigital);
        setLoading(false);
        return;
      }

      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 w-full">
        <h1 className="text-3xl font-bold mb-4 font-display text-neutral-900 dark:text-neutral-100">Project not found</h1>
        <Link to="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2 font-mono text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const date = project.createdAt?.toDate ? project.createdAt.toDate() : (project.createdAt ? new Date(project.createdAt) : null);
  const skills = project.skills || project.tags || [];

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-6 py-24 w-full scrapbook-element polaroid mt-12 mb-12 relative"
    >
      <div className="tape hidden dark:hidden sm:block"></div>
      <Link to={ project.category === 'Engineering' || project.category === 'Design' ? '/physical' : '/digital' } className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2 mb-12 font-mono text-xs uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to {project.category === 'Engineering' || project.category === 'Design' ? 'Physical' : 'Digital'}
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6 font-mono text-xs uppercase tracking-widest text-neutral-500 flex-wrap">
          <span className="text-neutral-900 dark:text-neutral-300 font-bold">{project.category}</span>
          <span className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
          {project.period && (
            <>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.period}</span>
            </>
          )}
          {date && (
            <>
              <span className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(date, 'MMM yyyy')}</span>
            </>
          )}
        </div>

        <h1 className={`text-4xl md:text-6xl font-bold tracking-tighter mb-6 font-display ${style === '95' ? 'text-black' : 'text-neutral-900 dark:text-neutral-100'}`}>
          {style === '95' ? <DecryptedText text={project.title} /> : project.title}
        </h1>

        <p className={`text-lg md:text-xl font-mono leading-relaxed mb-6 ${style === '95' ? 'text-black' : 'text-neutral-600 dark:text-neutral-400'}`}>
          {style === '95' ? <DecryptedText text={project.description} speed={30} /> : project.description}
        </p>

        {project.role && (
          <div className="text-sm border-l-2 border-neutral-300 dark:border-neutral-800 pl-4 py-1 text-neutral-600 dark:text-neutral-500 font-mono mb-8">
            <strong>Role:</strong> {project.role}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-mono rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </header>

      {project.thumbnail && (
        <div className="mb-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <img src={project.thumbnail} alt={project.title} className="w-full object-cover max-h-[60vh]" />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none font-sans dark:prose-headings:font-display prose-headings:font-bold prose-a:text-neutral-900 dark:prose-a:text-white prose-a:underline-offset-4 hover:prose-a:text-neutral-600 dark:hover:prose-a:text-neutral-400 transition-colors">
        <div className="markdown-body">
          <ReactMarkdown>{project.content || '*No detailed content provided for this project.*'}</ReactMarkdown>
        </div>
      </div>

      {project.link && (
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex justify-center">
             <a href={project.link} target="_blank" rel="noopener noreferrer" className="group rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-2">
                View Live Project
             </a>
        </div>
      )}
    </motion.article>
  );
}
