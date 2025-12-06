import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ScanEye, AlertTriangle, XCircle, Info, MousePointer2, Megaphone, Terminal } from 'lucide-react';
import { audioService } from '../services/audioService';

interface GreenwashingTerm {
  id: string;
  marketingPhrase: string;
  triggerWord: string;
  truth: string;
  icon: React.ElementType;
}

const TERMS: GreenwashingTerm[] = [
  {
    id: 'cotton',
    marketingPhrase: "Realizzato con misto di cotone consapevole per un futuro migliore.",
    triggerWord: "cotone consapevole",
    truth: "⚠️ 5% Cotone Organico, 95% Sintetico. Termine non regolamentato.",
    icon: AlertTriangle
  },
  {
    id: 'eco-collection',
    marketingPhrase: "Scopri la nostra Eco-Future Collection pensata per il pianeta.",
    triggerWord: "Eco-Future Collection",
    truth: "❌ Greenwashing Puro. Prodotta nelle stesse fabbriche inquinanti delle linee standard.",
    icon: XCircle
  },
  {
    id: 'vegan',
    marketingPhrase: "Accessori in pregiata Vegan Leather cruelty-free.",
    triggerWord: "Vegan Leather",
    truth: "🛢️ È Plastica (PU/PVC). Derivata dal petrolio, non biodegradabile. Inquina più della pelle.",
    icon: Info
  },
  {
    id: 'carbon',
    marketingPhrase: "Spedizione Carbon Neutral certificata.",
    triggerWord: "Carbon Neutral",
    truth: "💨 Le emissioni avvengono comunque. L'azienda paga solo quote (spesso dubbie) per compensare.",
    icon: AlertTriangle
  },
  {
    id: 'circular',
    marketingPhrase: "Unisciti al movimento della moda circolare.",
    triggerWord: "moda circolare",
    truth: "📉 Meno dell'1% dei vestiti viene realmente riciclato in nuovi vestiti. Il resto finisce in discarica.",
    icon: XCircle
  }
];

const GreenwashingTranslator: React.FC = () => {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Ref to trigger animation on scroll
  const textContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textContainerRef, { once: true, margin: "-100px" });

  // --- AUDIO ENGINE (using centralized service for iOS compatibility) ---
  const playGlitchSound = () => {
    audioService.play('hit');
  };

  const playKeystrokeSound = () => {
    audioService.play('click');
  };

  // Typewriter Logic - FASTER VERSION
  useEffect(() => {
    if (!isInView) return; // Only start when visible

    let isMounted = true;
    
    // Check if mobile to change the final instruction text
    const isMobile = window.innerWidth < 768;

    const typeSequence = async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Phase 1: "I brand comunicano bugie"
      const text1 = "I brand comunicano bugie";
      for (let i = 0; i <= text1.length; i++) {
        if (!isMounted) return;
        setTypedText(text1.slice(0, i));
        await wait(35 + Math.random() * 20); // Slightly slower for rhythm
      }
      
      await wait(500); // Short pause

      // Phase 2: Delete "bugie" (5 chars)
      for (let i = 0; i < 5; i++) {
        if (!isMounted) return;
        setTypedText(prev => prev.slice(0, -1));
        await wait(50);
      }

      await wait(200);

      // Phase 3: Type "con parole vuote per sembrare sostenibili."
      const text2 = "con parole vuote per sembrare sostenibili.";
      const currentBase = "I brand comunicano ";
      for (let i = 0; i <= text2.length; i++) {
        if (!isMounted) return;
        setTypedText(currentBase + text2.slice(0, i));
        await wait(30 + Math.random() * 15);
      }

      await wait(400);

      // Phase 4: "Abbiamo hackerato le loro campagne marketing: "
      const text3 = "\nAbbiamo hackerato le loro campagne marketing: ";
      const baseAfterText2 = currentBase + text2;
      for (let i = 0; i <= text3.length; i++) {
        if (!isMounted) return;
        setTypedText(baseAfterText2 + text3.slice(0, i));
        await wait(30 + Math.random() * 10);
      }

      await wait(200);

      // Phase 5: Dynamic Instruction based on Device
      const text4 = isMobile
         ? "tocca le parole verdi per scoprire la verità."
         : "passa il mouse sopra le parole per greenwasharle.";

      const baseAfterText3 = baseAfterText2 + text3;
      for (let i = 0; i <= text4.length; i++) {
        if (!isMounted) return;
        setTypedText(baseAfterText3 + text4.slice(0, i));
        await wait(30 + Math.random() * 10);
      }

    };

    typeSequence();

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
    }, 500);

    return () => {
        isMounted = false;
        clearInterval(cursorInterval);
    };
  }, [isInView]);

  // Helper function to render text with specific styles for keywords
  const renderStyledText = (text: string) => {
    // 1. Split at the final big sentence start
    const splitPhrase = "Abbiamo hackerato le loro campagne marketing: ";
    const parts = text.split(splitPhrase);

    const mainPart = parts[0];
    const bigPart = parts.length > 1 ? parts[1] : null;

    // 2. Format the main part (bold "sostenibili")
    const renderedMain = mainPart.split("sostenibili").flatMap((chunk, i, arr) => {
        if (i < arr.length - 1) {
            return [chunk, <strong key={i} className="text-white font-black">sostenibili</strong>];
        }
        return chunk;
    });

    return (
        <>
            {renderedMain}
            {parts.length > 1 && splitPhrase}
            {bigPart !== null && (
                 <span className="block mt-2 md:mt-4 text-lg md:text-3xl font-black text-genz-neon leading-tight tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                    {bigPart}
                 </span>
            )}
        </>
    );
  };

  return (
    <section className="py-10 md:py-24 bg-black border-b-2 border-white relative group-section overflow-hidden">
        <style>{`
          @keyframes toxic-scroll {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }
          @keyframes scan-line {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .toxic-bg {
            background-image: radial-gradient(#1a2e05 15%, transparent 16%), radial-gradient(#1a2e05 15%, transparent 16%);
            background-size: 60px 60px;
            background-position: 0 0, 30px 30px;
            animation: toxic-scroll 4s linear infinite;
          }
        `}</style>

        {/* 1. Animated Toxic Background (Global) */}
        <div className="absolute inset-0 bg-[#050505] toxic-bg opacity-40 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-12 relative z-10">

            {/* Header Layout */}
            <div className="flex flex-col items-center text-center mb-8 md:mb-20 relative">

                {/* 1. Badge Attivo */}
                <div className="mb-4 md:mb-8">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 text-genz-neon bg-black/80 border border-genz-neon px-2.5 md:px-4 py-1 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(212,255,0,0.3)]">
                        <ScanEye className="animate-pulse" size={14} />
                        <span className="font-mono font-bold uppercase tracking-widest text-[10px] md:text-xs">Decoder v.1.0</span>
                    </div>
                </div>

                {/* 2. TITOLO & SCANNER CONTAINER */}
                <div className="relative flex flex-col items-center w-full">

                    {/* CONTAINER RELATIVO PER TITOLO + RADAR */}
                    <div className="relative pb-2"> {/* Padding bottom minimal to touch the line */}

                        {/* RADAR SCANNER ANIMATION */}
                        {/* Precisely limited to this container's height */}
                        <motion.div
                            className="absolute left-0 right-0 h-[2px] md:h-[3px] bg-genz-neon shadow-[0_0_15px_#D4FF00] z-20 pointer-events-none"
                            initial={{ top: 0, opacity: 0 }}
                            animate={{
                                top: ["0%", "100%"],
                                opacity: [0, 1, 1, 0] // Fade out right at the end
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Titolo */}
                        <div className="relative z-10 p-2 md:p-4">
                            <h2 className="font-display text-2xl sm:text-5xl md:text-8xl font-black text-white uppercase leading-none text-shadow-neon">
                                Greenwashing <br/>
                                <span className="text-transparent text-stroke-lg">
                                    Translator
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* 3. SEPARATOR LINE (Target of Scan) */}
                    {/* Positioned immediately after the relative container */}
                    <div className="w-16 md:w-24 h-1 md:h-1.5 bg-genz-neon shadow-[0_0_10px_#D4FF00] mb-4 md:mb-8 relative z-10"></div>
                </div>

                {/* 4. Descrizione e Istruzioni */}
                <div ref={textContainerRef} className="max-w-3xl mx-auto bg-black/80 border border-white/20 backdrop-blur-md p-3 md:p-10 relative min-h-[140px] md:min-h-[220px] flex flex-col justify-start text-left shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    {/* Angoli decorativi */}
                    <div className="absolute -top-1 -left-1 w-3 md:w-4 h-3 md:h-4 border-t-2 border-l-2 border-genz-neon"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 border-b-2 border-r-2 border-genz-neon"></div>

                    {/* Typewriter Text with Styled Parts */}
                    <div className="font-sans text-sm md:text-2xl font-medium text-white leading-relaxed whitespace-pre-wrap">
                        {renderStyledText(typedText)}
                        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-genz-neon font-black ml-1 text-base md:text-2xl`}>|</span>
                    </div>

                </div>
            </div>

            {/* Translator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {TERMS.map((term) => (
                    <div key={term.id} className="relative group perspective-1000 z-10 hover:z-50">

                        {/* Card Styling */}
                        <div
                           className="bg-white p-5 md:p-8 border-2 border-gray-200 shadow-[4px_4px_0px_#1a1a1a] md:shadow-[8px_8px_0px_#1a1a1a] group-hover:shadow-[12px_12px_0px_#D4FF00] group-hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-center relative"
                           // On mobile, clicking card simulates hover
                           onClick={() => {
                               if (window.innerWidth < 768) {
                                  setHoveredTerm(hoveredTerm === term.id ? null : term.id);
                                  if (hoveredTerm !== term.id) playGlitchSound();
                               }
                           }}
                        >

                            {/* Fake "Ad" Label */}
                            <div className="absolute top-0 right-0 bg-gray-100 text-[8px] md:text-[10px] font-bold uppercase text-gray-400 tracking-widest border-l border-b border-gray-200 px-2 md:px-3 py-0.5 md:py-1">
                                Ad
                            </div>

                            <p className="font-display text-xl md:text-4xl leading-relaxed md:leading-snug text-black z-10 pt-4 md:pt-0">
                                {term.marketingPhrase.split(term.triggerWord)[0]}

                                {/* Interactive Trigger Word */}
                                <span
                                    className="relative inline-block cursor-help font-black text-green-700 decoration-wavy underline decoration-2 md:decoration-4 underline-offset-4 hover:bg-black hover:text-genz-neon hover:decoration-transparent px-1 md:px-2 mx-0.5 md:mx-1 transition-all duration-200"
                                    onMouseEnter={() => {
                                        // Only hover on desktop
                                        if (window.innerWidth >= 768) {
                                            setHoveredTerm(term.id);
                                            playGlitchSound();
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (window.innerWidth >= 768) setHoveredTerm(null);
                                    }}
                                >
                                    {term.triggerWord}

                                    {/* Tooltip Overlay - DESKTOP ONLY: above word */}
                                    <AnimatePresence>
                                        {hoveredTerm === term.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, rotateX: -15, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, rotateX: 15, y: 10 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-4 w-[400px] max-w-[90vw] z-[100]"
                                                style={{ pointerEvents: 'none' }}
                                            >

                                                {/* Truth Card */}
                                                <div className="bg-[#111] border-2 border-genz-neon p-5 shadow-[0px_10px_40px_rgba(0,0,0,0.9)] relative text-left">

                                                    {/* Glitch Overlay Effect */}
                                                    <div className="absolute inset-0 bg-genz-neon opacity-5 animate-pulse"></div>

                                                    <div className="flex items-start gap-4 relative z-10">
                                                        <div className="bg-genz-neon p-2 rounded-sm shrink-0">
                                                            <term.icon className="text-black" size={24} strokeWidth={2.5} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-mono text-genz-neon text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-gray-700 pb-1">
                                                                /// REALTÀ DEI FATTI
                                                            </h4>
                                                            <p className="font-sans text-white text-lg leading-tight font-bold">
                                                                {term.truth}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Decorative Arrow */}
                                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#111] border-r-2 border-b-2 border-genz-neon transform rotate-45"></div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </span>

                                {term.marketingPhrase.split(term.triggerWord)[1]}
                            </p>

                            {/* Tooltip - MOBILE ONLY: Centered above the card */}
                            <AnimatePresence>
                                {hoveredTerm === term.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="md:hidden absolute left-0 right-0 bottom-full mb-3 z-[100]"
                                        style={{ pointerEvents: 'none' }}
                                    >

                                        {/* Truth Card */}
                                        <div className="bg-[#111] border-2 border-genz-neon p-4 shadow-[0px_10px_40px_rgba(0,0,0,0.9)] relative text-left mx-0">

                                            {/* Glitch Overlay Effect */}
                                            <div className="absolute inset-0 bg-genz-neon opacity-5 animate-pulse"></div>

                                            <div className="flex items-start gap-3 relative z-10">
                                                <div className="bg-genz-neon p-2 rounded-sm shrink-0">
                                                    <term.icon className="text-black" size={20} strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <h4 className="font-mono text-genz-neon text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-gray-700 pb-1">
                                                        /// REALTÀ DEI FATTI
                                                    </h4>
                                                    <p className="font-sans text-white text-[15px] leading-snug font-bold">
                                                        {term.truth}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Decorative Arrow pointing down */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#111] border-r-2 border-b-2 border-genz-neon transform rotate-45"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}

                {/* Call to Action Box - RED BRUTALIST VERSION */}
                <div className="relative border-3 md:border-4 border-white bg-[#ff2a2a] p-5 md:p-8 flex flex-col justify-center items-center text-center shadow-[4px_4px_0px_#fff] md:shadow-[8px_8px_0px_#fff] group overflow-hidden hover:scale-[1.02] transition-transform duration-300">

                    {/* Noise Texture Overlay for that 'raw' paper feel */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'}}></div>

                    {/* Background Big Icon (Watermark) */}
                    <div className="absolute -right-6 md:-right-8 -bottom-6 md:-bottom-8 text-black opacity-20 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-500">
                         <Megaphone size={120} className="md:hidden" strokeWidth={6} />
                         <Megaphone size={200} className="hidden md:block" strokeWidth={6} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">

                        <h3 className="font-display text-3xl md:text-7xl font-black text-black leading-[0.85] mb-4 md:mb-6 uppercase drop-shadow-sm tracking-tighter">
                            Don't <br/> Buy <br/> The <span className="text-white">Lie.</span>
                        </h3>

                        {/* Sticker */}
                        <div className="bg-black text-white font-mono font-bold text-[10px] md:text-sm uppercase px-3 md:px-4 py-2 md:py-3 border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.5)] transform rotate-2 group-hover:-rotate-1 transition-transform">
                            Read the label, not the ad.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default GreenwashingTranslator;