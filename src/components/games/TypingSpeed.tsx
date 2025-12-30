import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const WORDS = [
  'cyber', 'neon', 'arcade', 'pixel', 'game', 'level', 'score', 'power',
  'speed', 'fast', 'type', 'quick', 'flash', 'code', 'hack', 'data',
  'byte', 'grid', 'zone', 'wave', 'rush', 'bolt', 'dash', 'zoom',
  'fury', 'blaze', 'storm', 'pulse', 'spark', 'glow', 'beam', 'laser',
];

const GAME_DURATION = 30;

export function TypingSpeed() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [currentWord, setCurrentWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bestWpm, setBestWpm] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const startGame = () => {
    setCurrentWord(getRandomWord());
    setInput('');
    setScore(0);
    setWpm(0);
    setTimeLeft(GAME_DURATION);
    setTotalChars(0);
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Calculate WPM
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const elapsed = GAME_DURATION - timeLeft;
    if (elapsed > 0) {
      const wpmCalc = Math.round((totalChars / 5) / (elapsed / 60));
      setWpm(wpmCalc);
    }
  }, [totalChars, timeLeft, gameState]);

  useEffect(() => {
    if (gameState === 'gameover' && wpm > bestWpm) {
      setBestWpm(wpm);
    }
  }, [gameState, wpm, bestWpm]);

  const handleInput = (value: string) => {
    if (gameState !== 'playing') return;
    setInput(value);

    // Admin: auto-complete after 2 characters
    if (isAdmin && value.length >= 2 && currentWord.startsWith(value)) {
      setScore(prev => prev + 1);
      setTotalChars(prev => prev + currentWord.length);
      setCurrentWord(getRandomWord());
      setInput('');
      return;
    }

    if (value === currentWord) {
      setScore(prev => prev + 1);
      setTotalChars(prev => prev + currentWord.length);
      setCurrentWord(getRandomWord());
      setInput('');
    }
  };

  const getCharColor = (index: number) => {
    if (index >= input.length) return 'text-muted-foreground';
    if (input[index] === currentWord[index]) return 'text-neon-green';
    return 'text-destructive';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Auto-complete after 2 chars!
        </div>
      )}

      <div className="flex items-center gap-6 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">WORDS</p>
          <p className="text-2xl font-bold text-neon-cyan">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-green/30">
          <p className="text-xs text-muted-foreground font-display">WPM</p>
          <p className="text-2xl font-bold text-neon-green">{wpm}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">TIME</p>
          <p className="text-2xl font-bold text-neon-magenta">{timeLeft}s</p>
        </div>
      </div>

      <div className="relative">
        <div className="glass-card p-8 rounded-xl border border-primary/30 min-w-[400px] text-center">
          {gameState === 'playing' && (
            <>
              <p className="text-sm text-muted-foreground mb-4">Type the word:</p>
              <div className="text-5xl font-display font-bold mb-6 tracking-wider">
                {currentWord.split('').map((char, index) => (
                  <span key={index} className={getCharColor(index)}>
                    {char}
                  </span>
                ))}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => handleInput(e.target.value.toLowerCase())}
                className="w-full text-center text-2xl font-display bg-muted border-2 border-primary/30 rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                autoComplete="off"
                autoCapitalize="off"
              />
            </>
          )}
        </div>

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <h3 className="text-2xl font-display text-primary neon-text mb-2">TYPING SPEED</h3>
            <p className="text-sm text-muted-foreground mb-4">How fast can you type?</p>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Test
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className="text-2xl font-display text-neon-cyan neon-text mb-2">TIME UP!</h3>
            <p className="text-3xl font-display font-bold text-neon-green mb-1">{wpm} WPM</p>
            <p className="text-muted-foreground mb-1">{score} words typed</p>
            <p className="text-sm text-muted-foreground mb-4">Best: {bestWpm} WPM</p>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
