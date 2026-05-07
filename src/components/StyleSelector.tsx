import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface StyleSelectorProps {
  onStyleSelect: (style: 'recursive' | '95') => void;
}

export default function StyleSelector({ onStyleSelect }: StyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(0); // Default to 95 (left side)
  const [selectedStyle, setSelectedStyle] = useState<'recursive' | '95' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    // Check if user has already made a selection
    const hasSelected = localStorage.getItem('style-preference');
    if (!hasSelected) {
      setIsOpen(true);
    }
  }, []);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderValue(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      handleSliderMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    // Auto-select based on slider position
    if (sliderValue < 50) {
      setSelectedStyle('95');
    } else {
      setSelectedStyle('recursive');
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleConfirm = () => {
    if (selectedStyle) {
      localStorage.setItem('style-preference', selectedStyle);
      onStyleSelect(selectedStyle);
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('style-preference', '95');
    onStyleSelect('95');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-[#333] p-8 md:p-12 relative"
          >
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="font-vulfpeck">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Choose Your Style
              </h2>
              <p className="text-[#888] mb-8 text-sm">
                Drag the slider to preview and select your preferred aesthetic
              </p>

              {/* Style Preview */}
              <div className="mb-8 relative h-48 md:h-64 border border-[#333] overflow-hidden">
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
                  }}
                >
                  {/* 95 Style Preview */}
                  <div className="w-full h-full bg-[#c0c0c0] p-6 flex flex-col justify-center">
                    <div className="bg-[#000080] text-white px-3 py-1 mb-4 font-bold text-sm" style={{ fontFamily: 'Trebuchet MS, Arial, sans-serif' }}>
                      Windows 95
                    </div>
                    <div className="bg-white border-2 border-b-[#c0c0c0] border-r-[#c0c0c0] border-t-[#000] border-l-[#000] p-4 shadow-[inset_1px_1px_0px_0px_#808080]">
                      <div className="text-black text-lg font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                        '95 STYLE
                      </div>
                      <div className="text-[#808080] text-xs mt-1" style={{ fontFamily: 'Times New Roman, serif' }}>
                        Retro • Nostalgic • Classic
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderValue}%)`,
                  }}
                >
                  {/* Recursive Style Preview */}
                  <div className="w-full h-full bg-[#0a0a0a] p-6 flex flex-col justify-center">
                    <div className="font-vulfpeck text-white text-xl md:text-2xl font-bold mb-2">
                      RECURSIVE
                    </div>
                    <div className="font-vulfpeck text-[#888] text-sm">
                      Mono • Casual • Text-Heavy
                    </div>
                    <div className="mt-4 font-vulfpeck text-[#666] text-xs">
                      Minimal gradients, maximum character
                    </div>
                  </div>
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white transition-all duration-75"
                  style={{ left: `${sliderValue}%` }}
                />
              </div>

              {/* Slider */}
              <div
                ref={sliderRef}
                className="relative h-2 bg-[#333] rounded-full cursor-pointer mb-6"
                onMouseDown={handleMouseDown}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-75"
                  style={{ width: `${sliderValue}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-75"
                  style={{ left: `${sliderValue}%`, transform: 'translate(-50%, -50%)' }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-xs text-[#666] mb-8 font-vulfpeck">
                <span>'95</span>
                <span>RECURSIVE</span>
              </div>

              {/* Selection Display */}
              {selectedStyle && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 border border-[#333] bg-[#111]"
                >
                  <div className="text-sm text-[#888] mb-1">Selected:</div>
                  <div className="text-white font-bold">
                    {selectedStyle === 'recursive' ? 'RECURSIVE STYLE' : "'95 STYLE"}
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 px-6 border border-[#333] text-[#888] hover:text-white hover:border-[#666] transition-all font-vulfpeck text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedStyle}
                  className="flex-1 py-3 px-6 bg-white text-black hover:bg-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-vulfpeck text-sm font-bold"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
