import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import AsciiWave from '../components/AsciiWave';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
      className="flex-1 flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <AsciiWave className="opacity-40" color="#ffffff" speed={0.5} />
      </div>

      <div 
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 mix-blend-difference perspective-[1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-center font-casual"
            style={{ translateZ: 50 }}
          >
            emtup works.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl font-mono text-neutral-400 max-w-2xl text-center"
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
          <Link to="/engineering" className="group flex items-center gap-3 border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4">
            Engineering & Design
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
          <Link to="/media" className="group flex items-center gap-3 border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 px-6 py-4 transition-all hover:pr-4">
            Visual & Audio Media
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
