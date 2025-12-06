import React, { useState } from 'react';
import { SECTIONS } from './constants';
import Section from './components/Section';
import ChatInterface from './components/ChatInterface';
import ComparisonSection from './components/ComparisonSection';
import GreenwashingTranslator from './components/GreenwashingTranslator';
import DarkPatternSection from './components/DarkPatternSection';
import GameSection from './components/GameSection';
import Header from './components/Header';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const [isChatOpen, setIsChatOpen] = useState(false); // Shared state for Chat/Game coordination

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll Y value to scale "SUCKS" 
  const sucksScale = useTransform(scrollY, [0, 300], [1, 1.5]);
  
  // Transform for "FAST FASHION" to decrease in size
  const fastFashionScale = useTransform(scrollY, [0, 300], [1, 0.6]);
  const fastFashionOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <div className="bg-white text-genz-black antialiased selection:bg-genz-neon selection:text-black overflow-x-hidden">
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-genz-neon transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Header Navigation */}
      <Header />

      {/* --- HERO SECTION --- */}
      <header className="min-h-[70vh] md:min-h-screen flex flex-col justify-between relative overflow-hidden bg-white border-b-2 border-black">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="flex items-center gap-4 mb-4">
               <span className="bg-genz-neon border border-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest shadow-brutal">
                 Tesi di Laurea
               </span>
               <span className="font-mono text-sm font-bold uppercase">Alessio Celentano</span>
            </div>
            
            {/* BIG H1 */}
            <h1 className="flex flex-col items-start font-display text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-8 relative z-20">
                {/* On mobile: no animation. On desktop: scroll animation */}
                <div className="leading-[0.8] md:hidden">FAST</div>
                <motion.div
                  className="leading-[0.8] hidden md:block"
                  style={{ scale: fastFashionScale, opacity: fastFashionOpacity, transformOrigin: 'bottom left' }}
                >
                  FAST
                </motion.div>

                <div className="leading-[0.8] md:hidden">FASHION</div>
                <motion.div
                  className="leading-[0.8] hidden md:block"
                  style={{ scale: fastFashionScale, opacity: fastFashionOpacity, transformOrigin: 'bottom left' }}
                >
                  FASHION
                </motion.div>

                <div className="text-black flex items-baseline gap-2 md:gap-4 leading-[0.8] md:hidden">
                  <span>SUCKS</span>
                </div>
                <motion.div
                  className="text-black items-baseline gap-4 leading-[0.8] hidden md:flex"
                  style={{ scale: sucksScale, transformOrigin: 'top left' }}
                >
                  <span>SUCKS</span>
                </motion.div>
            </h1>
            
            {/* Subtitle */}
            <div className="flex items-stretch gap-6 mt-8">
              <div className="w-4 md:w-6 bg-black shrink-0"></div>
              <div className="flex flex-col justify-center items-start gap-1 py-1">
                <p className="font-sans text-2xl md:text-4xl font-bold text-black leading-tight">
                  Sfida tra sostenibilità
                </p>
                <div className="bg-black px-3 py-1 -ml-1">
                  <p className="font-sans text-2xl md:text-4xl font-bold text-white leading-tight">
                    e profit oriented theory.
                  </p>
                </div>
                <p className="font-mono text-sm text-gray-500 mt-3 uppercase tracking-wide">
                  Analisi su Shein, Zara e il paradosso della Gen Z.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative z-10 bg-genz-neon border-y-2 border-black overflow-hidden py-3">
          <motion.div 
            className="whitespace-nowrap flex gap-8 font-display font-bold text-2xl uppercase tracking-wider"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                <span>Sustainability vs Profit</span>
                <span className="text-white text-stroke">•</span>
                <span>Fast Fashion Sucks</span>
                <span className="text-white text-stroke">•</span>
                <span>Gen Z Analysis</span>
                <span className="text-white text-stroke">•</span>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-24 right-6 md:right-12 z-10">
           <motion.button
             initial={{ opacity: 0, rotate: -90 }}
             animate={{ opacity: 1, rotate: 0 }}
             transition={{ delay: 0.8, duration: 0.5 }}
             onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
             className="bg-black text-white p-4 border-2 border-black hover:bg-genz-neon hover:text-black transition-colors shadow-brutal"
          >
            <ArrowDown size={32} />
          </motion.button>
        </div>
      </header>

      {/* --- NARRATIVE JOURNEY START --- */}
      <main>
        
        {/* 1. INTRODUZIONE: Il contesto */}
        <Section data={SECTIONS[0]} index={0} />

        {/* 2. IL PROBLEMA: Shein e l'Ultra Fast Fashion */}
        <Section data={SECTIONS[1]} index={1} />
        
        {/* 3. L'INGANNO: Neuromarketing Simulator */}
        <div id="darkpattern" className="relative">
          <DarkPatternSection />
        </div>

        {/* 4. L'ALTERNATIVA: Zara e la CSR */}
        <Section data={SECTIONS[2]} index={2} />

        {/* 5. IL CONFRONTO: Battle Arena */}
        <ComparisonSection />

        {/* 6. IL FUTURO: Metaverso */}
        <Section data={SECTIONS[3]} index={3} />

        {/* 7. IL PARADOSSO: Gen Z & Vietnam Study */}
        <Section data={SECTIONS[4]} index={4} />

        {/* 8. LA REALTÀ: Greenwashing Translator */}
        <div id="greenwashing" className="relative">
          <GreenwashingTranslator />
        </div>
        
        {/* 9. CONCLUSIONE: Quality Fast Fashion */}
        <Section data={SECTIONS[5]} index={5} />

        {/* 10. LA CONSEGUENZA: The Game */}
        <div id="game" className="relative border-t-2 border-black">
           <GameSection isChatOpen={isChatOpen} />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-12 pb-20 border-t-2 border-black">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-genz-neon text-center mb-8">
            THE END.
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <img
              src="/allegati/Logo_Vanvitelli_university.svg.png"
              alt="Università degli Studi della Campania Luigi Vanvitelli"
              className="h-16 md:h-20 w-auto object-contain invert"
            />
            <p className="font-display text-3xl md:text-5xl font-bold text-white italic">
              Alessio Celentano
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatInterface isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
      
    </div>
  );
};

export default App;