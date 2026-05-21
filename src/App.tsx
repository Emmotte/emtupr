import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Engineering from './pages/Engineering';
import Media from './pages/Media';
import ProjectDetail from './pages/ProjectDetail';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import StyleSelector from './components/StyleSelector';
import AsciiWave from './components/AsciiWave';

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

function AppContent() {
  const { theme, style, setStyle } = useTheme();

  return (
    <>
      <StyleSelector onStyleSelect={setStyle} />
      {style === 'recursive' && (
        <div className="ascii-wave-wrapper fixed inset-0 z-0 pointer-events-none opacity-40">
          <AsciiWave className="opacity-30 dark:opacity-40 relative z-0" color={theme === 'dark' ? '#ffffff' : '#000000'} speed={0.4} />
        </div>
      )}
      <div className="min-h-screen font-sans flex flex-col transition-colors duration-300">
        <Navigation />
        <main className="flex-1 flex flex-col pt-[84px]">
          <AnimatedRoutes />
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
