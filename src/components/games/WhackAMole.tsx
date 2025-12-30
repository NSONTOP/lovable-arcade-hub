import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 9;
const GAME_DURATION = 30;

export function WhackAMole() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [highScore, setHighScore] = useState(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setActiveMole(null);
    setGameState('playing');
  };

  const whackMole = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    
    if (index === activeMole) {
      setScore(prev => prev + (isAdmin ? 10 : 1));
      setActiveMole(null);
    }
  }, [gameState, activeMole, isAdmin]);

  // Mole appearance
  useEffect(() => {
    if (gameState !== 'playing') return;

    const showMole = () => {
      const randomHole = Math.floor(Math.random() * GRID_SIZE);
      setActiveMole(randomHole);
      
      // Admin: mole stays longer
      const hideDelay = isAdmin ? 2000 : 800 + Math.random() * 400;
      setTimeout(() => {
        setActiveMole(prev => prev === randomHole ? null : prev);
      }, hideDelay);
    };

    // Admin: moles appear more frequently
    const interval = setInterval(showMole, isAdmin ? 600 : 1000);
    showMole();

    return () => clearInterval(interval);
  }, [gameState, isAdmin]);

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

  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
    }
  }, [gameState, score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Moles stay longer, 10x points!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-green/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-green">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">TIME</p>
          <p className="text-2xl font-bold text-neon-cyan">{timeLeft}s</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
          <p className="text-xs text-muted-foreground font-display">BEST</p>
          <p className="text-2xl font-bold text-neon-yellow">{highScore}</p>
        </div>
      </div>

      <div className="relative">
        <div 
          className="grid grid-cols-3 gap-4 p-6 glass-card rounded-xl border border-primary/30"
          style={{ background: 'linear-gradient(180deg, #1a3a1a 0%, #0a1a0a 100%)' }}
        >
          {Array.from({ length: GRID_SIZE }).map((_, index) => (
            <button
              key={index}
              onClick={() => whackMole(index)}
              className={`
                w-20 h-20 md:w-24 md:h-24 rounded-full transition-all duration-100
                ${activeMole === index 
                  ? 'bg-neon-orange shadow-[0_0_30px_hsl(30,100%,55%,0.6)] scale-110 cursor-pointer' 
                  : 'bg-muted/50 border-2 border-primary/20'
                }
              `}
              disabled={gameState !== 'playing'}
            >
              {activeMole === index && (
                <span className="text-3xl">🦔</span>
              )}
            </button>
          ))}
        </div>

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">WHACK-A-MOLE</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className="text-2xl font-display text-neon-green neon-text mb-2">TIME UP!</h3>
            <p className="text-xl font-display text-foreground mb-4">Score: {score}</p>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
