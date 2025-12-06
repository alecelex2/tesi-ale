import React, { useEffect, useRef, useState } from 'react';

interface GameSectionProps {
  isChatOpen: boolean;
}

const GameSection: React.FC<GameSectionProps> = ({ isChatOpen }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isChatOpenRef = useRef(isChatOpen);
  const gameWrapperRef = useRef<HTMLDivElement>(null);

  // Sync ref with prop for the event listener closure
  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    // Auto-pause if chat opens while playing
    if (isChatOpen) {
       // Only pause if game is running (we check inside togglePause, or via logic here)
       if ((window as any).forcePause) {
           (window as any).forcePause();
       }
    }
  }, [isChatOpen]);

  useEffect(() => {
    // Initialize Game Logic
    const initGame = () => {
        const canvas = document.getElementById('snake-canvas') as HTMLCanvasElement;
        const gameContainerWrapper = document.getElementById('game-container-wrapper');
        
        if (!canvas || !gameContainerWrapper) return;

        const ctxGame = canvas.getContext('2d');
        if (!ctxGame) return;

        const overlay = document.getElementById('game-overlay');
        const pausedOverlay = document.getElementById('paused-overlay');
        const scoreDisplay = document.getElementById('score-display');
        const co2Display = document.getElementById('co2-display'); // New Element Ref
        const gameWrapper = gameContainerWrapper;

        // Dynamic Sizing Logic
        let tileCountX = 20;
        let tileCountY = 15;
        const gridSize = 25; 

        // Function to resize canvas and recalculate grid
        const resizeCanvas = () => {
            const rect = gameWrapper.getBoundingClientRect();
            // Set canvas internal resolution to match display size for crispness
            // OR keep a fixed ratio. Let's keep fixed logic but fit container.
            
            // To prevent stretching, we set the canvas width/height attributes
            // to match the container's width, and calculate height based on a ratio 
            // or available height, then update tileCounts.
            
            canvas.width = rect.width;
            canvas.height = rect.height; // Height is determined by CSS aspect-ratio

            // Recalculate tile counts based on new size
            tileCountX = Math.floor(canvas.width / gridSize);
            tileCountY = Math.floor(canvas.height / gridSize);
        };

        // Initial Resize
        resizeCanvas();

        // Listen for window resize
        window.addEventListener('resize', resizeCanvas);


        let score = 0;
        let co2 = 0; // New Variable
        let snake = [{x: 10, y: 10}];
        let velocity = {x: 0, y: 0};
        let food = {x: 15, y: 15, type: 0};
        let gameRunning = false;
        let gamePaused = false;
        let gameInterval: any;

        // Loghi Reali - Lista aggiornata: Zara, H&M, Shein, ASOS (No Pull&Bear)
        const brandImages: HTMLImageElement[] = [];
        const logoUrls = [
            'https://logo.clearbit.com/zara.com',
            'https://logo.clearbit.com/hm.com',
            'https://logo.clearbit.com/shein.com',
            'https://logo.clearbit.com/asos.com'
        ];
        
        logoUrls.forEach(url => {
            const img = new Image();
            img.src = url;
            brandImages.push(img);
        });

        // --- GLOBAL FUNCTIONS ---

        // SOUND EFFECT GENERATOR
        const playEatSound = () => {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContext) return;
                
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                // Retro 'Coin/Eat' Sound (Square Wave)
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);

                // Envelope
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.1);
            } catch (e) {
                // Ignore audio context errors
            }
        };

        const playGameOverSound = () => {
            try {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContext) return;
                
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                // 'Loser' / Power Down Sound (Sawtooth pitching down)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 1);

                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1);
            } catch (e) {
                // Ignore errors
            }
        };

        (window as any).startGame = function() {
            if(gameRunning && !gamePaused) return;
            if(gamePaused) { (window as any).togglePause(); return; }
            
            // Focus the wrapper so keys work immediately
            if (gameWrapper) gameWrapper.focus();

            // Ensure canvas is sized correctly before starting
            resizeCanvas();

            gameRunning = true;
            gamePaused = false;
            if(overlay) overlay.style.display = 'none';
            if(pausedOverlay) pausedOverlay.style.display = 'none';
            score = 0;
            co2 = 0; // Reset CO2
            snake = [{x: Math.floor(tileCountX/2), y: Math.floor(tileCountY/2)}];
            velocity = {x: 1, y: 0};
            
            // Reset Displays
            if(scoreDisplay) scoreDisplay.innerText = score.toString();
            if(co2Display) co2Display.innerText = co2.toString();

            placeFood();
            if(gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 100); 
        };

        (window as any).togglePause = function() {
            if(!gameRunning) return;
            gamePaused = !gamePaused;
            if(gamePaused) {
                clearInterval(gameInterval);
                if(pausedOverlay) pausedOverlay.style.display = 'block';
            } else {
                if(pausedOverlay) pausedOverlay.style.display = 'none';
                gameInterval = setInterval(gameLoop, 100);
                if(gameWrapper) gameWrapper.focus();
            }
        };

        // Added Force Pause for Chat interaction
        (window as any).forcePause = function() {
            if (gameRunning && !gamePaused) {
                gamePaused = true;
                clearInterval(gameInterval);
                if(pausedOverlay) pausedOverlay.style.display = 'block';
            }
        };

        (window as any).changeDirection = function(dir: string) {
             // Only allow direction change via buttons if game is actively being played or started
             if(!gameRunning) (window as any).startGame();
             switch(dir) {
                case 'left': if(velocity.x !== 1) velocity = {x: -1, y: 0}; break;
                case 'up': if(velocity.y !== 1) velocity = {x: 0, y: -1}; break;
                case 'right': if(velocity.x !== -1) velocity = {x: 1, y: 0}; break;
                case 'down': if(velocity.y !== -1) velocity = {x: 0, y: 1}; break;
            }
        };

        function placeFood() {
            // Ensure food is within current bounds
            food.x = Math.floor(Math.random() * (tileCountX - 1));
            food.y = Math.floor(Math.random() * (tileCountY - 1));
            food.type = Math.floor(Math.random() * brandImages.length);
            for(let part of snake) {
                if(part.x === food.x && part.y === food.y) placeFood();
            }
        }

        function gameLoop() {
            if(gamePaused) return;
            const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

            // Muri Infiniti
            if (head.x < 0) head.x = tileCountX - 1;
            if (head.x >= tileCountX) head.x = 0;
            if (head.y < 0) head.y = tileCountY - 1;
            if (head.y >= tileCountY) head.y = 0;

            // Collisione
            for(let i = 0; i < snake.length; i++) {
                if(head.x === snake[i].x && head.y === snake[i].y) {
                    resetGame();
                    return;
                }
            }

            snake.unshift(head);

            // Mangia
            if (head.x === food.x && head.y === food.y) {
                playEatSound(); // Play Sound
                score += 10;
                co2 += 15; // Increment CO2 by 15kg
                
                // Update UI
                if(scoreDisplay) scoreDisplay.innerText = score.toString();
                if(co2Display) co2Display.innerText = co2.toString();

                placeFood();
            } else {
                snake.pop();
            }

            drawGame();
        }

        function drawGame() {
            if (!ctxGame) return;
            ctxGame.fillStyle = '#111'; 
            ctxGame.fillRect(0, 0, canvas.width, canvas.height);

            // Disegna Serpente
            for(let i=0; i<snake.length; i++) {
                ctxGame.fillStyle = (i === 0) ? '#ccff00' : '#fff';
                ctxGame.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
            }

            // Disegna Cibo (Logo)
            const fx = food.x * gridSize;
            const fy = food.y * gridSize;
            
            // Sfondo Bianco per contrasto (essenziale anche in pixel art)
            ctxGame.fillStyle = '#ffffff';
            ctxGame.fillRect(fx, fy, gridSize, gridSize);
            
            try {
                if(brandImages[food.type].complete) {
                     ctxGame.drawImage(
                         brandImages[food.type], 
                         fx, 
                         fy, 
                         gridSize, 
                         gridSize
                     );
                } else {
                    // Fallback
                    ctxGame.fillStyle = '#ccff00';
                    ctxGame.fillRect(fx, fy, gridSize, gridSize);
                }
            } catch(e) {
                ctxGame.fillStyle = '#ccff00';
                ctxGame.fillRect(fx, fy, gridSize, gridSize);
            }
        }

        function resetGame() {
            playGameOverSound(); // Trigger 'Loser' sound
            gameRunning = false;
            gamePaused = false;
            clearInterval(gameInterval);
            if(overlay) {
                overlay.style.display = 'flex';
                // Updated Game Over screen to show CO2
                overlay.innerHTML = `
                    <h3 class="text-3xl md:text-4xl font-black mb-2" style="color:#ff2a2a">GAME OVER</h3>
                    <p class="text-white">SCORE: ${score}</p>
                    <p class="text-[#ff2a2a] font-bold">CO2 GENERATED: ${co2}kg</p>
                    <p class="text-sm font-mono bg-white text-black px-2 mt-2 inline-block">CLICK TO RESTART</p>
                `;
            }
            if(pausedOverlay) pausedOverlay.style.display = 'none';
        }

        // --- KEYBOARD HANDLING ---
        const handleKeydown = (e: KeyboardEvent) => {
            // 1. CHAT CHECK: If chat is open, completely ignore game keys
            if (isChatOpenRef.current) return;

            // 2. FOCUS CHECK: Game must be focused (clicked on) to intercept keys
            // We check if the game wrapper is the active element
            if (document.activeElement !== gameWrapper) return;

            // List of keys relevant to the game
            const gameKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "p", "P", "Enter"];
            
            // If it's not a game key, let it bubble (don't prevent default)
            if (!gameKeys.includes(e.key)) return;

            // Prevent default behavior (like scrolling) ONLY for game keys
            e.preventDefault();

            // Toggle Pause / Start
            if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
                (window as any).togglePause();
                return;
            }
            if (!gameRunning && (e.key === 'Enter')) {
                (window as any).startGame();
                return;
            }

            // Direction Logic
            switch(e.key) {
                case 'ArrowLeft': if(velocity.x !== 1) velocity = {x: -1, y: 0}; break;
                case 'ArrowUp': if(velocity.y !== 1) velocity = {x: 0, y: -1}; break;
                case 'ArrowRight': if(velocity.x !== -1) velocity = {x: 1, y: 0}; break;
                case 'ArrowDown': if(velocity.y !== -1) velocity = {x: 0, y: 1}; break;
            }
        };

        window.addEventListener('keydown', handleKeydown, false);

        // --- CLICK HANDLING ---
        const handleClick = (event: MouseEvent) => {
             if (!gameWrapper || !overlay) return;
            const isClickInside = gameWrapper.contains(event.target as Node);
            const isOverlay = overlay.contains(event.target as Node);
            const isPauseBtn = (event.target as Element).closest('button[title="Pause Game"]');

            // Explicitly focus game wrapper if clicked inside
            if (isClickInside || isOverlay) {
                gameWrapper.focus();
            }

            // Pause if clicking outside while running
            if (!isClickInside && !isOverlay && !isPauseBtn && gameRunning && !gamePaused) {
                (window as any).togglePause();
            }
        };
        
        document.addEventListener('click', handleClick);
        if(overlay) overlay.addEventListener('click', (window as any).startGame);

        // Draw Iniziale
        drawGame();

        return () => {
            // Cleanup
            window.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('click', handleClick);
            window.removeEventListener('resize', resizeCanvas);
            if(overlay) overlay.removeEventListener('click', (window as any).startGame);
            if(gameInterval) clearInterval(gameInterval);
        }
    };

    const cleanup = initGame();
    return () => { if(cleanup) cleanup(); };
  }, []); // Only run once on mount

  return (
    <>
    <style>
        {`
            /* Definisci variabili locali per garantire i colori esatti */
            #eat-the-brands-section {
                --ink: #111;
                --paper: #f4f4f0;
                --lime: #ccff00;
                --red: #ff2a2a;
                font-family: 'DM Sans', sans-serif;
            }

            /* Font Utility */
            .font-syne { font-family: 'Syne', sans-serif; }
            .font-scratch { font-family: 'Rock Salt', cursive; }

            /* Brutalist Utilities */
            .border-hard { border: 3px solid var(--ink); }
            .shadow-hard { box-shadow: 8px 8px 0px var(--ink); }

            /* Game Overlay Styles */
            .game-overlay {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: var(--lime);
                z-index: 20;
                font-family: 'Syne', sans-serif;
                text-align: center;
            }
            
            .paused-overlay {
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                background: var(--red);
                color: white;
                padding: 10px 20px;
                font-weight: bold;
                border: 3px solid black;
                display: none;
                pointer-events: none;
                font-family: 'Syne', sans-serif;
                text-transform: uppercase;
                box-shadow: 5px 5px 0px black;
                z-index: 30;
            }

            #snake-canvas {
                background-color: #000;
                image-rendering: pixelated; /* RIPRISTINATO STILE PIXEL */
                width: 100%;
                height: 100%;
                display: block;
            }

            /* Visual Keyboard */
            .key-cap {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #333;
                color: white;
                border: 2px solid #555;
                border-bottom: 4px solid #000;
                border-radius: 4px;
                font-family: monospace;
                font-weight: bold;
                width: 40px;
                height: 40px;
                box-shadow: 0 2px 0 #000;
            }
            
            /* Focus Indicator */
            #game-container-wrapper:focus {
                outline: 4px solid #ccff00;
                border-color: #000;
            }
        `}
    </style>

    {/* 3. STRUTTURA HTML (Sezione Intera) */}
    <section id="eat-the-brands-section" className="py-12 w-full bg-white border-b-2 border-black">
        <div className="container mx-auto px-4 max-w-7xl">
            
            {/* Container Principale Scuro */}
            <div className="bg-[#1a1a1a] p-4 md:p-8 relative border-hard shadow-hard">
                
                {/* Etichetta Rossa "Sticker" */}
                <div className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 bg-[#ff2a2a] border-hard px-4 md:px-6 py-1 md:py-2 rotate-1 z-10 w-[85%] md:w-auto text-center">
                    <h3 className="font-black text-lg md:text-2xl text-white uppercase font-syne">Eat The Brands</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    
                    {/* COLONNA SX: ISTRUZIONI & SCORE */}
                    <div className="text-white flex flex-col justify-center order-2 lg:order-1">
                        <h2 className="text-2xl md:text-4xl font-bold text-[#ccff00] mb-3 md:mb-4 font-syne">CONSUME OR DIE</h2>
                        <p className="mb-4 md:mb-6 font-mono text-xs md:text-sm text-gray-400">
                            Il consumismo è un serpente infinito. Mangia i loghi per accumulare punteggio, ma non mangiarti la coda.
                        </p>
                        
                        {/* Score Board & CO2 Metric */}
                        <div className="bg-gray-800 p-4 rounded border border-gray-600 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-[#ccff00]">SCORE</span>
                                <span id="score-display" className="font-mono text-xl">0</span>
                            </div>
                             {/* CO2 Row */}
                            <div className="flex justify-between items-center border-t border-gray-600 pt-2">
                                <span className="font-bold text-[#ff2a2a]">CO2 (kg)</span>
                                <span id="co2-display" className="font-mono text-xl text-[#ff2a2a]">0</span>
                            </div>
                        </div>

                        {/* How To Play (Desktop) */}
                        <div className="mb-4 hidden lg:block">
                            <p className="text-xs font-bold mb-2 text-gray-500 uppercase">How to Play</p>
                            <p className="text-[10px] text-gray-400 mb-2 italic">Click game area to start/focus</p>
                            <div className="flex flex-col items-center gap-2 w-fit mx-auto lg:mx-0">
                                <div className="key-cap">▲</div>
                                <div className="flex gap-2">
                                    <div className="key-cap">◀</div>
                                    <div className="key-cap">▼</div>
                                    <div className="key-cap">▶</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                <div className="key-cap" style={{width:'auto', padding:'0 10px', height: '30px'}}>P</div>
                                <span>= PAUSA</span>
                            </div>
                        </div>

                        {/* Controlli Mobile */}
                        <div className="grid grid-cols-3 gap-3 mt-4 lg:hidden">
                            <div></div>
                            <button onTouchStart={(e) => { e.preventDefault(); (window as any).changeDirection('up'); }} onClick={() => (window as any).changeDirection('up')} className="bg-[#ccff00] text-black font-bold py-4 text-2xl border-2 border-white rounded shadow-[4px_4px_0px_white] active:translate-y-1 active:shadow-none touch-manipulation">▲</button>
                            <div></div>
                            <button onTouchStart={(e) => { e.preventDefault(); (window as any).changeDirection('left'); }} onClick={() => (window as any).changeDirection('left')} className="bg-[#ccff00] text-black font-bold py-4 text-2xl border-2 border-white rounded shadow-[4px_4px_0px_white] active:translate-y-1 active:shadow-none touch-manipulation">◀</button>
                            <button onTouchStart={(e) => { e.preventDefault(); (window as any).changeDirection('down'); }} onClick={() => (window as any).changeDirection('down')} className="bg-[#ccff00] text-black font-bold py-4 text-2xl border-2 border-white rounded shadow-[4px_4px_0px_white] active:translate-y-1 active:shadow-none touch-manipulation">▼</button>
                            <button onTouchStart={(e) => { e.preventDefault(); (window as any).changeDirection('right'); }} onClick={() => (window as any).changeDirection('right')} className="bg-[#ccff00] text-black font-bold py-4 text-2xl border-2 border-white rounded shadow-[4px_4px_0px_white] active:translate-y-1 active:shadow-none touch-manipulation">▶</button>
                        </div>
                    </div>

                    {/* COLONNA DX: AREA GIOCO RESPONSIVE */}
                    <div 
                        ref={gameWrapperRef}
                        // Added w-full and responsive aspect ratio to fix stretching
                        className="lg:col-span-2 relative w-full aspect-[3/2] border-4 border-white order-1 lg:order-2 bg-black transition-all cursor-pointer" 
                        id="game-container-wrapper" 
                        tabIndex={0}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    >
                        
                        {/* Pulsante Pausa */}
                        <button onClick={() => (window as any).togglePause()} className="absolute top-4 right-4 z-30 bg-white text-black border-2 border-black p-2 font-bold hover:bg-[#ccff00] transition-colors" title="Pause Game">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </button>

                        {/* Canvas removed width/height hardcoding, handled via JS */}
                        <canvas id="snake-canvas"></canvas>
                        
                        <div id="game-overlay" className="game-overlay">
                            <h3 className="text-4xl font-black mb-2 text-white">CLICK TO PLAY</h3>
                            <p className="text-sm font-mono bg-black px-2">MANGIA I LOGHI</p>
                        </div>
                        
                        <div id="paused-overlay" className="paused-overlay">
                            PAUSED
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
};

export default GameSection;