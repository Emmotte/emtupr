import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Engineering from './pages/Engineering';
import Media from './pages/Media';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/engineering" element={<Engineering />} />
        <Route path="/media" element={<Media />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-[#ededed] font-sans selection:bg-neutral-800 selection:text-white flex flex-col">
        <Navigation />
        <main className="flex-1 flex flex-col pt-[84px]"> {/* offset for fixed header */}
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
