import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Leaf, Zap, DollarSign, BarChart3 } from 'lucide-react';

type ComparisonMetric = 'speed' | 'sustainability' | 'price' | 'digital';

interface DataPoint {
  label: string;
  shein: number;
  zara: number;
  unit: string;
  desc: string;
}

const DATA: Record<ComparisonMetric, DataPoint> = {
  speed: {
    label: 'Algorithm Speed',
    shein: 99, // Ultra Fast
    zara: 75, // Traditional Fast
    unit: 'AI Reactivity',
    desc: 'Shein vince con il modello "Test & Repeat" guidato dall\'AI: reazione ai trend in 3 giorni. Zara è veloce (3 settimane), ma segue logiche industriali più classiche.',
  },
  sustainability: {
    label: 'Social Legitimacy',
    shein: 15, // Low transparency
    zara: 85, // High CSR investment
    unit: 'CSR Score',
    desc: 'Zara applica la Stakeholder Theory: investimenti sociali e gestione etica (es. Covid response). Shein soffre di opacità nella supply chain e critiche sui diritti.',
  },
  price: {
    label: 'FOMO Factor',
    shein: 95, // High FOMO induction
    zara: 60, // Standard retail
    unit: 'Impulse Buy',
    desc: 'Shein usa scarsità artificiale e micro-lotti per generare ansia d\'acquisto (FOMO). Zara punta più sulla percezione di valore e "masstige".',
  },
  digital: {
    label: 'Born Digital',
    shein: 100, // Native
    zara: 70, // Hybrid
    unit: 'Cloud Supply Chain',
    desc: 'Shein è nativa digitale: nessun negozio, solo Cloud. Zara sta ibridando il modello, usando il Metaverso e l\'App come estensione del brand fisico.',
  }
};

const ComparisonSection: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<ComparisonMetric>('speed');

  // --- AUDIO SFX ENGINE ---
  const playMetricSound = (metric: ComparisonMetric) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      switch (metric) {
        case 'speed': // Whoosh / Speed
          const oscS = ctx.createOscillator();
          const gainS = ctx.createGain();
          oscS.type = 'sawtooth';
          oscS.frequency.setValueAtTime(150, now);
          oscS.frequency.exponentialRampToValueAtTime(1200, now + 0.25);
          gainS.gain.setValueAtTime(0.08, now);
          gainS.gain.linearRampToValueAtTime(0, now + 0.25);
          oscS.connect(gainS);
          gainS.connect(ctx.destination);
          oscS.start(now);
          oscS.stop(now + 0.3);
          break;

        case 'sustainability': // Ethics - Sparkling/Chime (C Major Arpeggio)
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => { 
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (i * 0.05));
            gain.gain.setValueAtTime(0.05, now + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + (i * 0.05));
            osc.stop(now + (i * 0.05) + 0.5);
          });
          break;

        case 'price': // Cash register / Cha-ching
          const oscP1 = ctx.createOscillator();
          const gainP1 = ctx.createGain();
          oscP1.type = 'square';
          oscP1.frequency.setValueAtTime(1200, now);
          gainP1.gain.setValueAtTime(0.05, now);
          gainP1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          oscP1.connect(gainP1);
          gainP1.connect(ctx.destination);
          oscP1.start(now);
          oscP1.stop(now + 0.08);

          const oscP2 = ctx.createOscillator();
          const gainP2 = ctx.createGain();
          oscP2.type = 'square';
          oscP2.frequency.setValueAtTime(2400, now + 0.1); // Higher pitch second beep
          gainP2.gain.setValueAtTime(0.05, now + 0.1);
          gainP2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          oscP2.connect(gainP2);
          gainP2.connect(ctx.destination);
          oscP2.start(now + 0.1);
          oscP2.stop(now + 0.4);
          break;

        case 'digital': // Rocket / Takeoff
          const oscD = ctx.createOscillator();
          const gainD = ctx.createGain();
          oscD.type = 'sawtooth';
          // Low rumble to high pitch
          oscD.frequency.setValueAtTime(50, now);
          oscD.frequency.exponentialRampToValueAtTime(800, now + 0.6);
          
          // LFO for "rumble" texture
          const lfo = ctx.createOscillator();
          lfo.type = 'square';
          lfo.frequency.value = 40; 
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 50; 
          lfo.connect(lfoGain);
          lfoGain.connect(oscD.frequency);
          lfo.start(now);
          lfo.stop(now + 0.6);

          gainD.gain.setValueAtTime(0.1, now);
          gainD.gain.linearRampToValueAtTime(0, now + 0.6);
          
          oscD.connect(gainD);
          gainD.connect(ctx.destination);
          oscD.start(now);
          oscD.stop(now + 0.6);
          break;
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleMetricChange = (metric: ComparisonMetric) => {
    setActiveMetric(metric);
    playMetricSound(metric);
  };

  const metrics: { id: ComparisonMetric; icon: React.ElementType; label: string }[] = [
    { id: 'speed', icon: Zap, label: 'AI Speed' },
    { id: 'sustainability', icon: Leaf, label: 'CSR/Ethics' },
    { id: 'price', icon: DollarSign, label: 'FOMO' },
    { id: 'digital', icon: TrendingUp, label: 'Digital' },
  ];

  return (
    <section className="py-8 md:py-24 border-b-2 border-black bg-genz-neon relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">

        {/* Section Header - Compact on mobile */}
        <div className="mb-4 md:mb-16 text-center">
          <h2 className="font-display text-2xl md:text-7xl font-bold text-black uppercase mb-2 md:mb-4">
            Battle Arena
          </h2>
          <p className="font-mono text-xs md:text-lg font-bold bg-black text-white inline-block px-2 md:px-4 py-1 uppercase transform -rotate-2 shadow-brutal">
            Shein vs Zara
          </p>
        </div>

        {/* Mobile Layout: Metric Buttons on top as horizontal row */}
        <div className="block lg:hidden mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {metrics.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMetricChange(m.id)}
                className={`flex items-center gap-1 px-3 py-2 border-2 border-black font-mono text-xs font-bold uppercase whitespace-nowrap transition-all duration-200 ${
                  activeMetric === m.id
                    ? 'bg-black text-genz-neon shadow-none'
                    : 'bg-white text-black shadow-brutal'
                }`}
              >
                <m.icon size={14} /> {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-start">

          {/* Controls - Left Side (Desktop only) */}
          <div className="hidden lg:flex w-full lg:w-1/3 flex-col gap-4">
            <div className="bg-white border-2 border-black p-4 md:p-6 shadow-brutal">
              <h3 className="font-display text-xl md:text-2xl font-bold mb-4 md:mb-6 uppercase flex items-center gap-2">
                <BarChart3 strokeWidth={3} size={20} /> Select Metric
              </h3>
              <div className="flex flex-col gap-3">
                {metrics.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleMetricChange(m.id)}
                    className={`flex items-center justify-between p-3 md:p-4 border-2 border-black font-mono text-sm md:text-base font-bold uppercase transition-all duration-300 ${
                      activeMetric === m.id
                        ? 'bg-black text-genz-neon translate-x-2 shadow-none'
                        : 'bg-white text-black hover:bg-gray-100 hover:translate-x-1 shadow-brutal'
                    }`}
                  >
                    <span className="flex items-center gap-2 md:gap-3">
                      <m.icon size={18} /> {m.label}
                    </span>
                    {activeMetric === m.id && <span className="text-[10px] md:text-xs animate-pulse">● ACTIVE</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box - Desktop */}
            <div className="bg-black text-white border-2 border-black p-4 md:p-6 shadow-brutal-lg mt-4">
              <h4 className="font-mono text-genz-neon text-xs md:text-sm uppercase font-bold mb-2">
                /// Insight
              </h4>
              <p className="font-sans text-sm md:text-lg leading-tight">
                {DATA[activeMetric].desc}
              </p>
            </div>
          </div>

          {/* Visualizer */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border-2 border-black p-4 md:p-12 shadow-brutal-lg flex flex-col justify-between relative">

              <div className="hidden md:block absolute top-4 right-4 font-mono text-xs text-gray-400 uppercase">
                Fig. VS.01 // {DATA[activeMetric].label}
              </div>

              {/* SHEIN BAR */}
              <div className="mb-3 md:mb-8 relative">
                <div className="flex justify-between items-end mb-1 md:mb-2 font-display font-bold text-base md:text-2xl uppercase">
                  <span>Shein</span>
                  <span className="text-xl md:text-4xl">{DATA[activeMetric].shein}%</span>
                </div>
                <div className="h-8 md:h-24 w-full bg-gray-100 border-2 border-black relative overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex justify-between px-2">
                     {[...Array(10)].map((_, i) => <div key={i} className="h-full w-[1px] bg-black/5"></div>)}
                  </div>

                  <motion.div
                    key={`shein-${activeMetric}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${DATA[activeMetric].shein}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-full bg-black border-r-2 border-black absolute top-0 left-0 flex items-center justify-end px-2 md:px-4"
                  >
                     <div className="hidden md:block text-white font-mono text-xs opacity-50 whitespace-nowrap">
                       {DATA[activeMetric].shein > 80 ? 'DOMINATING' : 'GROWING'}
                     </div>
                  </motion.div>
                </div>
              </div>

              {/* VS BADGE */}
              <div className="flex justify-center my-2 md:my-4">
                <div className="bg-genz-neon border-2 border-black rounded-full w-8 h-8 md:w-12 md:h-12 flex items-center justify-center font-black italic text-xs md:text-base z-20">
                  VS
                </div>
              </div>

              {/* ZARA BAR */}
              <div className="mt-3 md:mt-8">
                <div className="flex justify-between items-end mb-1 md:mb-2 font-display font-bold text-base md:text-2xl uppercase">
                  <span>Zara</span>
                  <span className="text-xl md:text-4xl">{DATA[activeMetric].zara}%</span>
                </div>
                <div className="h-8 md:h-24 w-full bg-gray-100 border-2 border-black relative overflow-hidden">
                   {/* Grid Lines */}
                   <div className="absolute inset-0 flex justify-between px-2">
                     {[...Array(10)].map((_, i) => <div key={i} className="h-full w-[1px] bg-black/5"></div>)}
                  </div>

                  <motion.div
                    key={`zara-${activeMetric}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${DATA[activeMetric].zara}%` }}
                    transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                    className="h-full border-r-2 border-black absolute top-0 left-0 bg-transparent flex items-center justify-end px-4"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #fff 10px, #fff 20px)'
                    }}
                  >
                  </motion.div>
                </div>
              </div>

              {/* Legend - compact on mobile */}
              <div className="mt-3 md:mt-8 pt-3 md:pt-6 border-t-2 border-dashed border-gray-300 flex flex-row gap-4 md:gap-6 text-[10px] md:text-sm font-mono text-gray-500 uppercase">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-black border border-black shrink-0"></div>
                  <span>Shein</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 border border-black shrink-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 4px, #fff 4px, #fff 8px)' }}></div>
                  <span>Zara</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Mobile Insight Box - at the bottom */}
        <div className="block lg:hidden mt-4">
          <div className="bg-black text-white border-2 border-black p-3 shadow-brutal-lg">
            <h4 className="font-mono text-genz-neon text-xs uppercase font-bold mb-1">
              /// Insight
            </h4>
            <p className="font-sans text-sm leading-tight">
              {DATA[activeMetric].desc}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ComparisonSection;