import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThesisSection } from '../types';
import { Star, Hexagon, Circle } from 'lucide-react';

interface SectionProps {
  data: ThesisSection;
  index: number;
}

const Section: React.FC<SectionProps> = ({ data, index }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isEven = index % 2 === 0;

  // Scroll hooks to track progress of THIS specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax Transforms for Background
  const yBgLarge = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yBgSmall = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]);
  
  // Image parallax
  const yImage = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Decorative Shape Transforms
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  // Speed up sliding
  const slideXFast = useTransform(scrollYProgress, [0, 1], [-150, 150]); 
  const slideX = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  
  const skewX = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  
  // Scale up
  const scaleGrow = useTransform(scrollYProgress, [0, 1], [0.8, 2.5]);
  const scalePulse = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.4, 0.8]);
  
  // Long travel for the star in section 5
  const starTravel = useTransform(scrollYProgress, [0, 0.8], [0, 600]);

  // Render a different shape based on the section index
  // UPDATED: Added 'hidden md:block' to prevent mobile visual clutter/overflow
  const renderDecorativeShape = () => {
    switch (index) {
      case 0: // Intro: Super Scratchy 4-Point Star
        return (
          <motion.div
            style={{ rotate }}
            className="absolute -top-8 -left-8 md:-top-16 md:-left-16 z-0 opacity-60 md:opacity-80"
          >
            {/* Aggressive 4-point star (Shuriken style) */}
            <svg className="w-20 h-20 md:w-[200px] md:h-[200px]" viewBox="0 0 100 100" fill="black">
               <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
            </svg>
          </motion.div>
        );
      case 1: // Shein: Barcode - Fast Slide & Scale
        return (
          <motion.div
            style={{ x: slideXFast, scale: scaleGrow }}
            className="absolute -top-4 md:-top-8 left-[30%] md:left-0 z-0 flex gap-0.5 md:gap-1 opacity-50 md:opacity-70 origin-left mix-blend-multiply"
          >
             {[...Array(6)].map((_, i) => (
               <div key={i} className={`bg-black h-10 md:h-24 ${i % 3 === 0 ? 'w-0.5 md:w-1' : i % 2 === 0 ? 'w-1 md:w-2' : 'w-2 md:w-4'}`}></div>
             ))}
          </motion.div>
        );
      case 2: // Zara: Razor Shards - Fixed Clipping
        return (
          <motion.div
            style={{ skewX: skewX, x: slideX }}
            className="absolute -top-6 md:-top-44 left-12 md:left-0 z-0 opacity-60 md:opacity-80"
          >
             <svg className="w-24 h-16 md:w-[300px] md:h-[200px]" viewBox="0 0 300 200" fill="black">
                <path d="M20,0 L100,180 L120,50 L200,140 L220,0 L300,120 L280,0 Z" />
             </svg>
          </motion.div>
        );
      case 3: // Metaverse: Digital Glitch Block
        return (
          <motion.div
            className="absolute -top-8 md:-top-16 -left-4 md:-left-8 z-0 flex items-end gap-0.5 md:gap-1"
          >
             {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    height: useTransform(scrollYProgress, [0, 0.5, 1], [10 + (i*8), 50 - (i*5), 10 + (i*8)])
                  }}
                  className="w-3 md:w-6 bg-black border border-white"
                />
             ))}
             <motion.div
                style={{ opacity: scalePulse }}
                className="w-3 h-3 md:w-6 md:h-6 bg-genz-neon border border-black mb-1 md:mb-2 ml-1 md:ml-2"
             />
          </motion.div>
        );
      case 4: // Gen Z: Sharp Needle Star sliding to image
        return (
           <motion.div
             style={{ x: starTravel, rotate: rotate }}
             className="absolute -top-12 md:-top-24 left-0 z-20 mix-blend-difference pointer-events-none opacity-60 md:opacity-100"
           >
              {/* 12-Point Sharp Burst Star */}
              <svg className="w-16 h-16 md:w-[180px] md:h-[180px]" viewBox="0 0 200 200" fill="black">
                 <path d="M100,0 L110,80 L190,50 L120,100 L190,150 L110,120 L100,200 L90,120 L10,150 L80,100 L10,50 L90,80 Z" />
              </svg>
           </motion.div>
        );
       case 5: // Conclusion: Animated Black Checkmark
        return (
          <motion.div
            className="absolute -top-4 md:-top-32 left-0 md:-left-12 z-0 opacity-80 md:opacity-100"
          >
             <svg className="w-16 h-16 md:w-[240px] md:h-[240px]" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
               <motion.path
                 d="M20 50 L40 75 L85 20"
                 initial={{ pathLength: 0, opacity: 0 }}
                 whileInView={{ pathLength: 1, opacity: 1 }}
                 viewport={{ once: false, margin: "0px" }}
                 transition={{ duration: 1.2, ease: "easeOut" }}
               />
             </svg>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Helper for animated highlight word
  const HighlightWord = ({
    text,
    color,
    delay = 0,
    targetTextColor = "#ffffff"
  }: {
    text: string,
    color: string,
    delay?: number,
    targetTextColor?: string
  }) => (
    <span className="relative inline-block mx-1 md:mx-2 align-bottom">
      <span
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: color }}
      />
      <span className="relative px-1 block" style={{ color: targetTextColor }}>
        {text}
      </span>
    </span>
  );

  // Custom Title Rendering per Section
  const renderAnimatedTitle = () => {
    switch (index) {
      case 0: // Intro: "Fast Fashion SUCKS?" (Red)
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            Fast Fashion{' '}
            <HighlightWord text="Sucks?" color="#FF2A2A" />
          </h2>
        );
        
      case 1: // Shein: "ULTRA Fast Fashion" (Purple)
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            <HighlightWord text="Ultra" color="#C026D3" />
            Fast Fashion
          </h2>
        );

      case 2: // Zara: "STAKEHOLDER Theory" (Acid Orange)
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            <HighlightWord text="Stakeholder" color="#FF5F00" />
            Theory
          </h2>
        );

      case 3: // Metaverse: "Into the METAVERSE" (Deep Blue)
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            Into the
            <HighlightWord text="Metaverse" color="#0033FF" />
          </h2>
        );

      case 4: // Gen Z: "GEN Z & Green GAP" (Yellow - Text remains BLACK)
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            <HighlightWord text="Gen Z" color="#FFFF00" targetTextColor="#000000" />
            & Green
            <HighlightWord text="Gap" color="#FFFF00" delay={0.2} targetTextColor="#000000" />
          </h2>
        );
      
      case 5: // Conclusion: "Quality Fast Fashion" (Green) - FIXED: Quality has green bg
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            <HighlightWord text="Quality" color="#00C040" />
            Fast Fashion
          </h2>
        );

      default:
        return (
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[0.9] uppercase tracking-tight">
            {data.title}
          </h2>
        );
    }
  };

  return (
    <section
      id={data.id}
      ref={sectionRef}
      className={`min-h-screen flex items-center py-20 md:py-24 border-b-2 border-black overflow-hidden relative ${isEven ? 'bg-white' : 'bg-gray-50'}`}
    >
      {/* --- Background Animated Elements --- */}
      
      {/* 1. Large Rotating Shape (Opposite side of content) - Hidden on mobile */}
      <motion.div
        style={{ y: yBgLarge, rotate: rotateBg, opacity: opacityBg }}
        className={`absolute top-20 ${isEven ? 'right-[-5%]' : 'left-[-5%]'} z-0 pointer-events-none text-black hidden md:block`}
      >
         {isEven ? (
           <Star size={400} strokeWidth={0.5} className="text-black fill-transparent" />
         ) : (
           index === 5 ? <Circle size={400} strokeWidth={0.5} className="text-black fill-transparent" /> :
           <Hexagon size={400} strokeWidth={0.5} className="text-black fill-transparent" />
         )}
      </motion.div>

      {/* 2. Floating Geometric Pattern - Hidden on mobile */}
      <motion.div
        style={{ y: yBgSmall, opacity: 0.1 }}
        className={`absolute bottom-40 ${isEven ? 'left-[10%]' : 'right-[10%]'} z-0 pointer-events-none hidden md:block`}
      >
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-16 h-16 border-2 border-black border-dashed rounded-none transform rotate-45 animate-spin-slow" style={{ animationDuration: `${(i+1)*5}s` }}></div>
          ))}
        </div>
      </motion.div>

      {/* 3. Huge Background Text */}
      <motion.div 
         style={{ x: useTransform(scrollYProgress, [0, 1], isEven ? [-200, 0] : [200, 0]), opacity: 0.05 }}
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
      >
        <h1 className="font-display text-[12vw] md:text-[10vw] leading-none font-black uppercase text-transparent" style={{ WebkitTextStroke: '2px black' }}>
          {data.id}
        </h1>
      </motion.div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-24 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          
          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-center">
             <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
             >
                {/* Header Area with Decorative Graphics */}
                <div className="relative mb-6 pt-12 md:pt-24"> 
                   
                   {/* Dynamic Brutalist Shape */}
                   {renderDecorativeShape()}
                   
                   <div className="flex items-center gap-4 relative z-10">
                      <span className="font-display text-4xl md:text-6xl font-bold text-stroke opacity-30">
                        0{index + 1}
                      </span>
                      <div className="h-1 flex-1 bg-black"></div>
                   </div>
                </div>

                {/* Render Animated Title Function */}
                {renderAnimatedTitle()}
                
                {data.subtitle && (
                  <div className="inline-block bg-genz-neon border border-black px-4 py-2 mb-8 shadow-brutal transform -rotate-1 hover:rotate-2 transition-transform duration-300">
                    <h3 className="font-mono text-xs md:text-base font-bold uppercase tracking-wider text-black">
                      {data.subtitle}
                    </h3>
                  </div>
                )}

                <p
                  className="font-sans text-lg md:text-xl leading-relaxed text-gray-800 font-medium border-l-4 border-black pl-6 bg-white/50 backdrop-blur-sm py-2 [&>strong]:font-black [&>strong]:text-black"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
             </motion.div>
          </div>

          {/* Image Visual */}
          <div className="flex-1 relative group mt-8 lg:mt-0 w-full max-w-lg mx-auto">
            <motion.div
              style={{ y: yImage }}
              className="relative z-10"
            >
              <div className="relative border-2 border-black bg-white p-2 shadow-brutal-lg group-hover:shadow-brutal-hover group-hover:translate-x-2 group-hover:translate-y-2 transition-all duration-300">
                 <div className="aspect-[4/5] overflow-hidden border border-black transition-all duration-500">
                    <img 
                      src={data.image} 
                      alt={data.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                 </div>
                 <div className="absolute -top-4 -right-4 bg-black text-genz-neon px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-white shadow-sm">
                    Fig. {index + 1}.0
                 </div>
              </div>

              {/* Image Decorative Elements - Smaller on mobile */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-16 h-16 md:w-32 md:h-32 border-2 border-black z-[-1] flex items-center justify-center bg-genz-neon">
                  <div className="w-10 h-10 md:w-20 md:h-20 border border-black animate-ping opacity-20"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-black border-dashed z-[-2] opacity-30"></div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Section;