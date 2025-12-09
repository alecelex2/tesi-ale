import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { Send, Loader2, ImagePlus, BrainCircuit, X, Sparkles, MessageSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Easter Eggs - Secret Commands
const EASTER_EGGS: Record<string, string> = {
  '/konami': '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️\n\n🎮 CHEAT CODE ACTIVATED!\n+30 vite\n+∞ sostenibilità\n-100% fast fashion\n\nCongratulazioni, hai sbloccato la coscienza etica! 🏆',
  'up up down down left right left right b a': '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️\n\n🎮 KONAMI CODE DETECTED!\nSei un vero gamer old school! 👾\n\nFun fact: Questo codice fu creato da Kazuhisa Hashimoto nel 1986 per Gradius.',
  '42': '🌌 La risposta alla domanda fondamentale sulla vita, l\'universo e tutto quanto!\n\nMa qual era la domanda? Forse: "Quanti capi compra in media una persona da Shein all\'anno?"\n\n...no aspetta, quella risposta è molto più triste. 😅\n\n📚 Douglas Adams approva questo messaggio.',
  'hello world': '```python\nprint("Hello, sustainable world!")\n# TODO: fix fast_fashion.destroy()\n# BUG: capitalism.exe has stopped working\n```\n\n👨‍💻 Ah, un programmatore! Benvenuto nel club. Il codice della moda sostenibile è ancora in beta...',
  '/matrix': '🔴 Pillola rossa: scopri quanto costa davvero un vestito da 5€\n🔵 Pillola blu: continua a credere che Shein sia "affordable fashion"\n\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\nWake up, Neo...\nThe fast fashion has you.\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n\n🐇 Follow the sustainable rabbit.',
  'chi ti ha creato': '👨‍🎓 Sono stata creata da **Alessio Celentano** per la sua tesi di laurea!\n\nLa tesi esplora il mondo del fast fashion, il greenwashing e le strategie dei brand nel metaverso.\n\nSono basata su Gemini AI, ma il mio stile e la mia personalità sono stati plasmati per questa ricerca. ✨\n\n...e no, non sono parente di Adriano Celentano 🎤😄',
  'chi ti ha creato?': '👨‍🎓 Sono stata creata da **Alessio Celentano** per la sua tesi di laurea!\n\nLa tesi esplora il mondo del fast fashion, il greenwashing e le strategie dei brand nel metaverso.\n\nSono basata su Gemini AI, ma il mio stile e la mia personalità sono stati plasmati per questa ricerca. ✨\n\n...e no, non sono parente di Adriano Celentano 🎤😄',
  '/help': '🔮 **Easter Eggs Segreti**\n\nHai trovato il menu nascosto! Ecco alcuni hint:\n\n• Prova un famoso codice da videogiochi...\n• Il numero che risponde a tutto\n• Il primo programma di ogni dev\n• Una pillola rossa o blu?\n• Chiedi delle mie origini\n\nBuona caccia! 🎯',
  'sus': '📮 AMOGUS?!\n\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣤⣤⣤⣤⣤⣀\n⠀⠀⠀⠀⠀⠀⠀⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷\n⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷\n\nShein è un po\' sus però... 👀',
  '/credits': '🎬 **CREDITS**\n\n📝 Tesi: Alessio Celentano\n🤖 AI: Google Gemini + custom prompt\n🎨 Design: Brutalist + Gen-Z aesthetic\n🎮 Game: Inspired by retro arcade\n💻 Tech: React + TypeScript + Vite\n\n🎵 Soundtrack: 8-bit vibes\n☕ Powered by: troppi caffè\n\n© 2024 - Made with 💚 for sustainability',

  // Easter Eggs personali - Amici
  '/modesto': '🇫🇷 **PARIGI, 2024**\n\n"Ciao amico! Bello braccialetto, vero?"\n\n💸 -20€\n🎭 +1 lezione di vita\n📍 Location: Montmartre\n\nLa vera truffa non è il fast fashion...\nè fidarsi di chi ti lega un braccialetto al polso. 🪢\n\n**(Press F per Modesto)** 🫡\n\nRicorda: se qualcuno ti ferma per strada a Parigi, CORRI.',
};

// Check if input matches any easter egg (case insensitive)
const checkEasterEgg = (input: string): string | null => {
  const normalizedInput = input.toLowerCase().trim();

  for (const [trigger, response] of Object.entries(EASTER_EGGS)) {
    if (normalizedInput === trigger.toLowerCase()) {
      return response;
    }
  }
  return null;
};

interface ChatInterfaceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: Role.MODEL, text: "Ehi! 👋 LEXAWRLD_AI connessa.\nPossiamo parlare di Shein, Zara, Metaverse o curiosità sulla tesi. Chiedi pure! ✨" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [useThinking, setUseThinking] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // Focus management: Auto-focus input when chat opens or loading finishes
  useEffect(() => {
    if (isOpen && !isLoading) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading]);

  // --- AUDIO SFX ENGINE (using centralized service for iOS compatibility) ---
  const playRetroSound = (type: 'click' | 'send' | 'receive') => {
    audioService.play(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        playRetroSound('click');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    playRetroSound('send');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    // Check for easter eggs first (only if no image attached)
    const easterEggResponse = !selectedImage ? checkEasterEgg(currentInput) : null;

    if (easterEggResponse) {
      // Easter egg found - respond instantly without API call
      setSelectedImage(null);

      // Small delay to simulate typing
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: Role.MODEL,
          text: easterEggResponse,
        };
        setMessages(prev => [...prev, aiMsg]);
        playRetroSound('receive');
      }, 300);

      return;
    }

    setIsLoading(true);

    // Temporary image hold for API call
    const imageToSend = selectedImage;
    setSelectedImage(null);

    try {
      const responseText = await sendMessageToGemini(
        messages,
        userMsg.text || "Analizza questa immagine nel contesto della tesi.",
        imageToSend,
        { useThinking }
      );

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        isThinking: useThinking
      };
      setMessages(prev => [...prev, aiMsg]);
      playRetroSound('receive');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    // Explicitly unlock audio on iOS on first interaction
    audioService.unlock();
    playRetroSound('click');
    onOpenChange(!isOpen);
  };

  // Parse Markdown-style bolding (**text**)
  const renderFormattedText = (text: string) => {
    // Regex to match **bold** segments
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={index} className="font-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-genz-neon text-black p-4 md:p-5 border-2 border-black shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        onClick={toggleOpen}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={28} strokeWidth={3} /> : <MessageSquare size={28} strokeWidth={3} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-20 right-2 left-2 md:left-auto md:right-8 w-auto md:w-[450px] h-[70vh] md:h-[600px] max-h-[600px] bg-white border-2 border-black shadow-brutal-lg flex flex-col z-40 font-mono"
          >
            {/* Header */}
            <div className="bg-black text-genz-neon p-4 border-b-2 border-black flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-genz-neon animate-pulse"></div>
                <h3 className="font-bold uppercase tracking-widest text-sm">LEXAWRLD_AI</h3>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 border border-genz-neon"></div>
                <div className="w-3 h-3 border border-genz-neon bg-genz-neon"></div>
              </div>
            </div>

            {/* Config Bar */}
            <div className="bg-white border-b-2 border-black p-3 flex items-center justify-between">
              <label 
                className={`flex items-center gap-2 cursor-pointer select-none text-xs font-bold uppercase border-2 px-2 py-1 transition-colors ${useThinking ? 'bg-black text-genz-neon border-black' : 'bg-white text-black border-gray-300'}`}
                onClick={() => playRetroSound('click')}
              >
                 <input 
                    type="checkbox" 
                    checked={useThinking} 
                    onChange={(e) => setUseThinking(e.target.checked)} 
                    className="hidden"
                  />
                  <BrainCircuit size={14} />
                  {useThinking ? 'Deep Think' : 'Speed Mode'}
              </label>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                {useThinking ? 'Gemini-3-Pro' : 'Gemini-2.5-Flash'}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50" style={{backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px'}}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}
                >
                  <div className="mb-1 text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1 bg-white px-1 border border-black w-fit">
                    {msg.role === Role.USER ? 'USER_01' : 'LEXAWRLD_AI'}
                    {msg.role === Role.MODEL && <div className="w-1 h-1 bg-genz-neon rounded-full"></div>}
                  </div>
                  
                  <div
                    className={`max-w-[90%] p-4 border-2 border-black shadow-brutal text-sm font-sans font-medium ${
                      msg.role === Role.USER
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    {msg.image && (
                      <div className="border border-white/20 mb-3">
                        <img src={msg.image} alt="Upload" className="w-full h-auto" />
                      </div>
                    )}
                    
                    {msg.isThinking && (
                      <div className="mb-3 bg-gray-100 p-2 border border-gray-300 font-mono text-xs text-gray-600 flex flex-col gap-1">
                        <div className="flex items-center gap-1 font-bold text-purple-600 uppercase">
                          <BrainCircuit size={12} /> Deep Processing
                        </div>
                        <div className="h-1 w-full bg-gray-200 overflow-hidden">
                          <motion.div 
                            className="h-full bg-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <p className="whitespace-pre-wrap leading-relaxed">{renderFormattedText(msg.text)}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="mb-1 text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1 bg-white px-1 border border-black w-fit">
                     LEXAWRLD_AI
                     <div className="w-1 h-1 bg-genz-neon rounded-full animate-pulse"></div>
                  </div>
                  <div className="bg-white border-2 border-black shadow-brutal p-3 min-w-[100px]">
                    <div className="flex items-center gap-2">
                       <span className="font-mono text-xs font-bold uppercase">Typing</span>
                       <div className="flex gap-1">
                          <motion.div 
                            className="w-1.5 h-1.5 bg-black"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div 
                            className="w-1.5 h-1.5 bg-black"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-1.5 h-1.5 bg-black"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                          />
                       </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t-2 border-black">
              {selectedImage && (
                <div className="relative inline-block mb-2 border-2 border-black">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover grayscale" />
                  <button 
                    onClick={() => { setSelectedImage(null); playRetroSound('click'); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 border border-black hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => { fileInputRef.current?.click(); playRetroSound('click'); }}
                  className="p-3 border-2 border-black bg-gray-100 hover:bg-genz-neon transition-colors"
                  title="Upload Image"
                >
                  <ImagePlus size={20} strokeWidth={2.5} />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Scrivi a LEXAWRLD_AI..."
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 text-base md:text-sm font-bold placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:bg-gray-50 transition-all"
                    disabled={isLoading}
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-black text-genz-neon p-3 border-2 border-black hover:bg-genz-neon hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatInterface;