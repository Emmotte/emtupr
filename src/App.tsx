import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
// ... (existing imports)

function RedirectHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      delete sessionStorage.redirect;
      const path = redirect.replace(window.location.origin, '');
      navigate(path);
    }
  }, [navigate]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        {/* ... */}
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { theme, style, setStyle } = useTheme();

  return (
    <>
      <RedirectHandler />
      <StyleSelector onStyleSelect={setStyle} />
      {/* ... */}

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
