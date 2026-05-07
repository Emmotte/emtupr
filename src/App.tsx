import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Engineering from './pages/Engineering';
import Media from './pages/Media';
import ProjectDetail from './pages/ProjectDetail';
import { ThemeProvider } from './components/ThemeProvider';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/engineering" element={<Engineering />} />
        <Route path="/media" element={<Media />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen font-sans flex flex-col transition-colors duration-300">
          <Navigation />
          <main className="flex-1 flex flex-col pt-[84px]"> {/* offset for fixed header */}
            <AnimatedRoutes />
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
