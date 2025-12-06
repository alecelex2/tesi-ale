import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'intro', label: 'Intro' },
  { id: 'shein', label: 'Shein' },
  { id: 'darkpattern', label: 'Dark Pattern' },
  { id: 'zara', label: 'Zara' },
  { id: 'metaverse', label: 'Metaverso' },
  { id: 'genz', label: 'Gen Z' },
  { id: 'greenwashing', label: 'Greenwashing' },
  { id: 'conclusion', label: 'Conclusione' },
  { id: 'game', label: 'The Game' },
];

const Header: React.FC = () => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    // On mobile, toggle the color animation
    if (window.innerWidth < 768) {
      setIsMobileActive(!isMobileActive);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Combined state for coloring (either hover on desktop or click on mobile)
  const isActive = isLogoHovered || isMobileActive;

  return (
    <nav
      className="fixed top-2 left-0 right-0 z-40 px-4"
    >
      <div className="container mx-auto">
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] px-4 py-3 flex items-center justify-between">
          {/* Logo with expanding text on desktop, color change on mobile */}
          <button
            onClick={handleLogoClick}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            className="font-display text-2xl md:text-3xl font-black text-black transition-colors overflow-hidden cursor-pointer"
          >
            {/* Mobile version: just FFS? with S and ? colored on click */}
            <span className="inline-flex md:hidden">
              <span>FF</span>
              <span className={`transition-colors duration-300 ${isMobileActive ? 'text-[#FF2A2A]' : ''}`}>S?</span>
            </span>

            {/* Desktop version: expanding text on hover */}
            <span className="hidden md:inline-flex">
              <span>F</span>
              <AnimatePresence mode="wait">
                {isLogoHovered ? (
                  <motion.span
                    key="expanded-f"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    ast&nbsp;
                  </motion.span>
                ) : null}
              </AnimatePresence>
              <span>F</span>
              <AnimatePresence mode="wait">
                {isLogoHovered ? (
                  <motion.span
                    key="expanded-f2"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    ashion&nbsp;
                  </motion.span>
                ) : null}
              </AnimatePresence>
              <span className={isLogoHovered ? 'text-[#FF2A2A]' : ''}>S</span>
              <AnimatePresence mode="wait">
                {isLogoHovered ? (
                  <motion.span
                    key="expanded-s"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
                    className="overflow-hidden whitespace-nowrap text-[#FF2A2A]"
                  >
                    ucks
                  </motion.span>
                ) : null}
              </AnimatePresence>
              <span className={isLogoHovered ? 'text-[#FF2A2A]' : ''}>?</span>
            </span>
          </button>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-mono text-sm font-bold uppercase tracking-wider px-3 py-2 hover:bg-black hover:text-genz-neon transition-all duration-200 border border-transparent hover:border-black cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden font-mono text-xs font-bold uppercase border-2 border-black px-3 py-2 hover:bg-black hover:text-genz-neon transition-all cursor-pointer"
            onClick={() => {
              const menu = document.getElementById('mobile-menu');
              if (menu) menu.classList.toggle('hidden');
            }}
          >
            Menu
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className="hidden md:hidden bg-white border-2 border-t-0 border-black shadow-[4px_4px_0px_#000] mt-0"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                scrollToSection(item.id);
                const menu = document.getElementById('mobile-menu');
                if (menu) menu.classList.add('hidden');
              }}
              className="block w-full text-left font-mono text-sm font-bold uppercase tracking-wider px-4 py-3 hover:bg-black hover:text-genz-neon transition-all duration-200 border-b border-gray-200 last:border-b-0 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
