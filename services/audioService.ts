// Centralized Audio Service for iOS/Safari compatibility
// iOS requires AudioContext to be created and resumed after user interaction

type SoundType = 'click' | 'send' | 'receive' | 'eat' | 'gameOver' | 'hit' | 'data' | 'toxicOn' | 'toxicOff' | 'reveal' | 'swoosh';

class AudioService {
  private audioContext: AudioContext | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    // Try to create AudioContext immediately
    this.initContext();
  }

  private initContext(): void {
    if (this.audioContext) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (e) {
      // Will try again on user interaction
    }
  }

  // Initialize and unlock audio context on first user interaction
  unlock(): void {
    if (this.isUnlocked && this.audioContext?.state === 'running') return;

    try {
      // Create context if not exists
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        this.audioContext = new AudioContextClass();
      }

      // iOS Safari requires resume() after user gesture
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Play a silent oscillator to fully unlock on iOS
      // This is more reliable than buffer on some iOS versions
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      gain.gain.value = 0; // Silent
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(0);
      osc.stop(this.audioContext.currentTime + 0.001);

      this.isUnlocked = true;
    } catch (e) {
      console.warn('Audio unlock failed:', e);
    }
  }

  // Play a retro-style sound effect
  play(type: SoundType): void {
    // Always try to unlock/resume first
    if (!this.audioContext) {
      this.initContext();
    }

    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }

    if (!this.audioContext || this.audioContext.state !== 'running') {
      return;
    }

    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      const now = this.audioContext.currentTime;

      switch (type) {
        case 'click':
          // Short, crisp blip
          osc.type = 'square';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'send':
          // Ascending swipe
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.15);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'receive':
          // Soft digital chime
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.setValueAtTime(500, now + 0.1);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case 'eat':
          // Quick upward blip for eating
          osc.type = 'square';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case 'gameOver':
          // Descending tone for game over
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;

        case 'hit':
          // Short hit sound
          osc.type = 'square';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'data':
          // Mechanical click sound for data processing
          osc.type = 'square';
          osc.frequency.setValueAtTime(200 + Math.random() * 800, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;

        case 'toxicOn':
          // Harsh alarm sound (sawtooth ramping up)
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(800, now + 0.1);
          osc.frequency.linearRampToValueAtTime(600, now + 0.3);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;

        case 'toxicOff':
          // Relief / power down sound (sine ramping down)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;

        case 'reveal':
          // Reveal/unveil sound
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.linearRampToValueAtTime(800, now + 0.15);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'swoosh':
          // Swoosh sound for transitions
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
      }
    } catch (e) {
      // Silently fail if audio doesn't work
    }
  }

  // Check if audio is available
  isAvailable(): boolean {
    return this.isUnlocked && this.audioContext !== null;
  }
}

// Singleton instance
export const audioService = new AudioService();

// Auto-unlock on first user interaction
// iOS requires non-passive listeners and immediate handling
if (typeof window !== 'undefined') {
  let unlocked = false;

  const unlockAudio = () => {
    if (unlocked) return;
    unlocked = true;

    audioService.unlock();

    // Remove all listeners after first successful unlock
    document.removeEventListener('touchstart', unlockAudio, true);
    document.removeEventListener('touchend', unlockAudio, true);
    document.removeEventListener('click', unlockAudio, true);
    document.removeEventListener('keydown', unlockAudio, true);
    document.removeEventListener('mousedown', unlockAudio, true);
  };

  // Use capture phase (true) for earlier event handling on iOS
  document.addEventListener('touchstart', unlockAudio, { capture: true, passive: true });
  document.addEventListener('touchend', unlockAudio, { capture: true, passive: true });
  document.addEventListener('click', unlockAudio, { capture: true, passive: true });
  document.addEventListener('keydown', unlockAudio, { capture: true, passive: true });
  document.addEventListener('mousedown', unlockAudio, { capture: true, passive: true });
}
