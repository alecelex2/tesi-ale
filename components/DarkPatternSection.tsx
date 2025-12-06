import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Eye, Clock, ShoppingBag, Flame, AlertTriangle, Zap, AlertOctagon } from 'lucide-react';

const DarkPatternSection: React.FC = () => {
  const [isToxicMode, setIsToxicMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [stock, setStock] = useState(3); // Starts very low for scarcity
  const [viewers, setViewers] = useState(12);
  const [popups, setPopups] = useState<{id: number, text: string}[]>([]);
  
  // Refs for Animation
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, amount: 0.5 }); // ONCE: TRUE (No reset on scroll up)
  
  // Glitch Text State
  const [headerText, setHeaderText] = useState("________________"); // Placeholder length
  const [subHeaderText, setSubHeaderText] = useState("_________");
  const [isGlitching, setIsGlitching] = useState(false);

  // Fake User Names for Social Proof
  const fakeUsers = ['Giulia da Milano', 'Marco da Roma', 'Sara da Londra', 'Emma da Berlino', 'Luca da Torino'];

  // --- AUDIO ENGINE: DATA PROCESS SOUND ---
  const playDataSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Mechanical click sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(200 + Math.random() * 800, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
        // Ignore audio errors
    }
  };

  // --- AUDIO ENGINE: TOXIC SWITCH SOUND ---
  const playToxicSwitchSound = (activating: boolean) => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (activating) {
            // HARSH ALARM SOUND (Sawtooth ramping up)
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.1); // Rise fast
            osc.frequency.linearRampToValueAtTime(600, now + 0.3); // Drop slightly
            
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        } else {
            // RELIEF / POWER DOWN SOUND (Sine ramping down)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
            
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);
            
            osc.start(now);
            osc.stop(now + 0.4);
        }
    } catch(e) {
        // Ignore audio errors
    }
  };

  // --- GLITCH / DECODE EFFECT LOGIC ---
  // State for mobile 3-line version
  const [line1Text, setLine1Text] = useState("NEURO");
  const [line2Text, setLine2Text] = useState("MARKETING");
  const [line3Text, setLine3Text] = useState("SIMULATOR");

  useEffect(() => {
    if (isInView) {
      setIsGlitching(true);
      const target1 = "NEUROMARKETING";
      const target2 = "SIMULATOR";
      const targetLine1 = "NEURO";
      const targetLine2 = "MARKETING";
      const targetLine3 = "SIMULATOR";
      
      // FIX: Restricted character set to avoid symbols that change line-height (like | _ ^ [ ])
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&?"; 
      
      let iterations = 0;

      const interval = setInterval(() => {
        // Update Line 1 (desktop)
        setHeaderText(target1.split("").map((letter, index) => {
          if (index < iterations) return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));

        // Update Line 2 (desktop)
        setSubHeaderText(target2.split("").map((letter, index) => {
            if (index < iterations - 5) return letter;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));

        // Update mobile 3-line version
        setLine1Text(targetLine1.split("").map((letter, index) => {
          if (index < iterations) return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));

        setLine2Text(targetLine2.split("").map((letter, index) => {
          if (index < iterations - 2) return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));

        setLine3Text(targetLine3.split("").map((letter, index) => {
          if (index < iterations - 4) return letter;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(""));

        playDataSound();

        if (iterations >= Math.max(target1.length, target2.length) + 5) {
          clearInterval(interval);
          setIsGlitching(false);
          // Ensure final text is clean
          setHeaderText(target1);
          setSubHeaderText(target2);
          setLine1Text(targetLine1);
          setLine2Text(targetLine2);
          setLine3Text(targetLine3);
        }

        iterations += 1 / 2;
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isInView]);


  // Timer Logic (Panic Mode)
  useEffect(() => {
    let interval: any;
    if (isToxicMode) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
        // Randomly fluctuate viewers
        setViewers((prev) => Math.max(15, prev + Math.floor(Math.random() * 5) - 2));
        // Randomly decrease stock occasionally, but keep it at least 1
        if (Math.random() > 0.95) setStock((prev) => Math.max(1, prev - 1));
      }, 1000);
    } else {
      setTimeLeft(600);
      setStock(500); // Normal stock invisible
      setViewers(1); // Just you
    }
    return () => clearInterval(interval);
  }, [isToxicMode]);

  // Reset stock when mode changes
  useEffect(() => {
    if (isToxicMode) {
        setStock(3); // Reset to 3 when entering toxic mode
    }
  }, [isToxicMode]);

  // Random Popups Logic
  useEffect(() => {
    let popupInterval: any;
    if (isToxicMode) {
      popupInterval = setInterval(() => {
        const id = Date.now();
        const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
        const text = `${user} ha completato l'ordine!`;
        setPopups((prev) => [...prev.slice(-2), { id, text }]); // Keep max 3 popups
        
        // Remove popup after 3 seconds
        setTimeout(() => {
            setPopups((prev) => prev.filter(p => p.id !== id));
        }, 3000);

      }, 3500);
    } else {
      setPopups([]);
    }
    return () => clearInterval(popupInterval);
  }, [isToxicMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-12 md:py-24 bg-white border-b-2 border-black relative overflow-hidden">
      
      <style>{`
        @keyframes hypnotic-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .hypnotic-bg {
          background-image: radial-gradient(circle, #000 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          animation: hypnotic-scroll 3s linear infinite;
        }
      `}</style>

      {/* Background Animated */}
      <div className="absolute inset-0 opacity-10 pointer-events-none hypnotic-bg" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header with Decoding/Glitch Effect Only */}
        <div ref={titleRef} className="text-center mb-8 md:mb-16 flex flex-col justify-center items-center perspective-1000">
          
          {/* FOMO Title Block */}
          <div className="mb-6 md:mb-12 flex flex-col items-center">
             <div className="inline-flex items-center gap-2 bg-black text-genz-neon px-2 md:px-3 py-1 font-bold mb-3 md:mb-6 border-2 border-genz-neon shadow-brutal transform -rotate-1">
                <AlertOctagon size={16} />
                <span className="text-[10px] md:text-xs uppercase tracking-widest">Manipulation Detected</span>
             </div>
             <h2 className="font-display font-black text-black uppercase leading-[0.9] tracking-tighter text-center">
                <span className="block text-2xl md:text-4xl lg:text-5xl">Come fa</span>
                <span className="block text-[11vw] sm:text-[10vw] lg:text-[8rem] leading-[0.85]">SHEIN</span>
                <span className="block text-2xl md:text-4xl lg:text-5xl">a creare</span>
                <span className="block text-[14vw] sm:text-[12vw] lg:text-[10rem] leading-[0.85]">FOMO?</span>
             </h2>
          </div>

          <div className="relative inline-block w-full max-w-2xl">
             {/* Decorative 'Processing' Bar (Linea di separazione) */}
             <motion.div 
               initial={{ width: 0 }}
               animate={isInView ? { width: "100%" } : { width: 0 }}
               transition={{ duration: 0.5 }}
               className="h-2 bg-black mb-1 mx-auto"
             />

             {/* FIX: Fixed height container to prevent layout shifting during glitch */}
             <div className="min-h-[120px] md:min-h-[180px] flex flex-col justify-center items-center mb-2">
                {/* Desktop: 2 lines */}
                <h2 className="hidden md:flex font-display text-4xl md:text-7xl font-black italic uppercase leading-none flex-col items-center">
                    <span className={`block h-[1.1em] flex items-center justify-center transition-colors duration-100 px-2 ${isGlitching ? 'bg-black text-genz-neon' : 'text-black'}`}>
                        {headerText}
                    </span>
                    <span className={`block h-[1.1em] flex items-center justify-center mt-3 transition-colors duration-100 px-2 ${isGlitching ? 'text-black' : 'bg-genz-neon text-black shadow-brutal'}`}>
                        {subHeaderText}
                    </span>
                </h2>

                {/* Mobile: 3 lines (NEURO / MARKETING / SIMULATOR) */}
                <h2 className="flex md:hidden font-display text-3xl font-black italic uppercase leading-none flex-col items-center">
                    <span className={`block h-[1.1em] flex items-center justify-center transition-colors duration-100 px-2 ${isGlitching ? 'bg-black text-genz-neon' : 'text-black'}`}>
                        {line1Text}
                    </span>
                    <span className={`block h-[1.1em] flex items-center justify-center mt-1 transition-colors duration-100 px-2 ${isGlitching ? 'bg-black text-genz-neon' : 'text-black'}`}>
                        {line2Text}
                    </span>
                    <span className={`block h-[1.1em] flex items-center justify-center mt-1 transition-colors duration-100 px-2 ${isGlitching ? 'text-black' : 'bg-genz-neon text-black shadow-brutal'}`}>
                        {line3Text}
                    </span>
                </h2>
             </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-sans text-base md:text-2xl max-w-3xl mx-auto text-gray-600 font-medium leading-relaxed mt-1 px-2"
          >
            Il Fast Fashion sfrutta i bias cognitivi per manipolare le tue scelte.
            <span className="hidden md:inline"><br/></span>{' '}
            Attiva la simulazione per smascherare le <span className="font-bold text-black">tecniche ingannevoli</span> che spingono all'acquisto compulsivo.
          </motion.p>
        </div>

        {/* Simulator Interface */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-12 items-center lg:items-start justify-center">

          {/* Mobile: Button first */}
          <div className="w-full lg:hidden max-w-[450px]">
            <div className="bg-gray-100 p-3 border-2 border-black shadow-brutal flex flex-col items-center text-center">
              <button
                onClick={() => {
                    playToxicSwitchSound(!isToxicMode);
                    setIsToxicMode(!isToxicMode);
                }}
                className={`relative w-full py-3 border-2 border-black font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-brutal hover:translate-y-1 hover:shadow-none ${isToxicMode ? 'bg-[#ff2a2a] text-white animate-pulse' : 'bg-white text-black hover:bg-genz-neon'}`}
              >
                {isToxicMode ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertTriangle size={18} /> DISATTIVA FOMO
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={18} /> ATTIVA FOMO
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop: Controls / Explanation */}
          <div className="hidden lg:block w-full lg:w-1/2 max-w-[450px] space-y-6">

            {/* The Switch */}
            <div className="bg-gray-100 p-6 border-2 border-black shadow-brutal flex flex-col items-center text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-4">Pannello di Controllo</h3>

              <button
                onClick={() => {
                    playToxicSwitchSound(!isToxicMode);
                    setIsToxicMode(!isToxicMode);
                }}
                className={`relative w-full py-5 border-2 border-black font-bold uppercase tracking-widest text-lg transition-all duration-200 shadow-brutal hover:translate-y-1 hover:shadow-none ${isToxicMode ? 'bg-[#ff2a2a] text-white animate-pulse' : 'bg-white text-black hover:bg-genz-neon'}`}
              >
                {isToxicMode ? (
                  <span className="flex items-center justify-center gap-2">
                    <AlertTriangle size={24} /> DISATTIVA MODALITÀ FAST FASHION
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={24} /> ATTIVA MODALITÀ FAST FASHION
                  </span>
                )}
              </button>
            </div>

            {/* Analysis Panel - Desktop */}
            <div className={`p-6 border-2 border-black transition-colors duration-500 ${isToxicMode ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>
              <h4 className="font-mono text-sm md:text-base font-bold uppercase mb-4 border-b border-gray-600 pb-2">
                /// Analisi
              </h4>

              <ul className="space-y-4 font-sans text-sm md:text-base">
                <li className={`flex items-start gap-4 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Clock className={`shrink-0 mt-1 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={24} />
                  <div>
                    <strong className="block font-bold uppercase mb-1">Fake Urgency</strong>
                    Timer e countdown fittizi. L'ansia temporale riduce la capacità critica.
                  </div>
                </li>
                <li className={`flex items-start gap-4 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Eye className={`shrink-0 mt-1 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={24} />
                  <div>
                    <strong className="block font-bold uppercase mb-1">Social Proof</strong>
                    Notifiche di acquisto e contatori visite generati da algoritmi.
                  </div>
                </li>
                <li className={`flex items-start gap-4 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Flame className={`shrink-0 mt-1 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={24} />
                  <div>
                    <strong className="block font-bold uppercase mb-1">SCARSITÀ PROGRAMMATA</strong>
                    L'etichetta "Ultimi pezzi" serve a innescare la FOMO.
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* The Product Card (The Stage) */}
          <div className="w-full lg:w-1/2 relative max-w-[450px]">
             
             {/* Random Popups Overlay */}
             <div className="absolute top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                  {popups.map((popup) => (
                    <motion.div
                      key={popup.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-white border-2 border-black p-4 shadow-brutal flex items-center gap-4 w-72 md:w-80"
                    >
                       <div className="bg-green-100 text-green-600 p-2 rounded-full"><ShoppingBag size={18}/></div>
                       <span className="text-sm font-bold text-black">{popup.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             {/* The Card Itself */}
             <motion.div 
               animate={{ 
                 scale: isToxicMode ? [1, 1.01, 1] : 1,
                 borderColor: isToxicMode ? '#ff2a2a' : '#000000'
               }}
               transition={{ duration: 0.5 }}
               className={`relative bg-white border-4 p-0 shadow-brutal-lg overflow-hidden transition-colors duration-300 ${isToxicMode ? 'border-[#ff2a2a]' : 'border-black'}`}
             >
                {/* TOXIC HEADER - Always takes space */}
                <div className={`text-center py-3 font-black uppercase text-lg md:text-xl flex justify-center items-center gap-2 transition-all duration-300 ${isToxicMode ? 'bg-[#ff2a2a] text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                  {isToxicMode ? (
                    <>
                      <Clock size={24} className="animate-spin" />
                      OFFERTA LAMPO: {formatTime(timeLeft)}
                    </>
                  ) : (
                    <span className="text-sm">Spedizione Standard</span>
                  )}
                </div>

                {/* PRODUCT IMAGE AREA */}
                <div className="relative aspect-[4/3] bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Product" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* TOXIC OVERLAYS */}
                    {isToxicMode && (
                      <>
                        <div className="absolute top-4 left-4 bg-[#ff2a2a] text-white px-4 py-2 font-black text-xl md:text-2xl -rotate-6 shadow-brutal border-2 border-white z-10">
                          -90% OFF
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur text-white py-2 px-6 text-sm font-bold flex justify-between items-center">
                           <span className="flex items-center gap-2 text-genz-neon"><Eye size={16}/> {viewers} stanno guardando</span>
                           <span className="text-[#ff2a2a] animate-pulse uppercase">🔥 Richiesta Alta</span>
                        </div>
                      </>
                    )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                       <div>
                         <h3 className={`font-bold text-xl md:text-2xl uppercase leading-none ${isToxicMode ? 'text-[#ff2a2a] font-black' : 'text-black'}`}>
                            {isToxicMode ? '🔥 VIRAL TRENDY TOP 🔥' : 'T-Shirt Base in Cotone'}
                         </h3>
                         <p className="text-xs text-gray-500 font-mono mt-1">
                           {isToxicMode ? 'SKU: 999123-FAST-DROP' : '100% Cotone Organico. Produzione Etica.'}
                         </p>
                       </div>
                    </div>

                    {/* PRICE - Fixed height container */}
                    <div className="my-4 h-12 flex items-end">
                      {isToxicMode ? (
                         <div className="flex items-end gap-2">
                            <span className="text-gray-400 line-through text-lg font-bold">€ 49.99</span>
                            <span className="text-[#ff2a2a] text-4xl font-black tracking-tighter leading-none">€ 4.99</span>
                         </div>
                      ) : (
                         <div className="text-3xl font-bold">€ 35.00</div>
                      )}
                    </div>

                    {/* ACTION BUTTON */}
                    <button className={`w-full py-3 font-bold uppercase tracking-wider text-base border-2 border-black transition-all ${
                       isToxicMode
                         ? 'bg-[#ff2a2a] text-white shadow-[4px_4px_0px_#000] animate-bounce'
                         : 'bg-black text-white hover:bg-genz-neon hover:text-black'
                    }`}>
                       {isToxicMode ? '⚡ ACQUISTA ORA ⚡' : 'Aggiungi al Carrello'}
                    </button>

                    {/* STOCK WARNING - Fixed height */}
                    <div className="mt-3 text-center h-5">
                      {isToxicMode ? (
                        <span className="text-[#ff2a2a] font-black text-sm uppercase animate-pulse">
                           ⚠️ Solo {stock} pezzi rimasti!
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">
                           Disponibilità immediata.
                        </span>
                      )}
                    </div>
                </div>

             </motion.div>
          </div>

          {/* Mobile: Analysis Panel after product card */}
          <div className="w-full lg:hidden max-w-[450px]">
            <div className={`p-4 border-2 border-black transition-colors duration-500 ${isToxicMode ? 'bg-black text-white' : 'bg-white text-gray-500'}`}>
              <h4 className="font-mono text-xs font-bold uppercase mb-3 border-b border-gray-600 pb-2">
                /// Analisi
              </h4>

              <ul className="space-y-3 font-sans text-xs">
                <li className={`flex items-start gap-3 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Clock className={`shrink-0 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={18} />
                  <div>
                    <strong className="block font-bold uppercase">Fake Urgency</strong>
                    Timer fittizi riducono la capacità critica.
                  </div>
                </li>
                <li className={`flex items-start gap-3 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Eye className={`shrink-0 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={18} />
                  <div>
                    <strong className="block font-bold uppercase">Social Proof</strong>
                    Notifiche generate da algoritmi.
                  </div>
                </li>
                <li className={`flex items-start gap-3 ${isToxicMode ? 'opacity-100' : 'opacity-40'}`}>
                  <Flame className={`shrink-0 ${isToxicMode ? 'text-[#ff2a2a]' : ''}`} size={18} />
                  <div>
                    <strong className="block font-bold uppercase">Scarsità Programmata</strong>
                    "Ultimi pezzi" innesca la FOMO.
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default DarkPatternSection;