import { useState, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';

export function ReactionTime() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'tooearly'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);

    // Admin: shorter wait time
    const delay = isAdmin ? 500 + Math.random() * 500 : 1000 + Math.random() * 4000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'tooearly') {
      startGame();
      return;
    }

    if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setGameState('tooearly');
      return;
    }

    if (gameState === 'ready') {
      let time = Date.now() - startTimeRef.current;
      
      // Admin: subtract time for better score
      if (isAdmin) {
        time = Math.max(50, time - 100);
      }
      
      setReactionTime(time);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setGameState('result');
    }
  };

  const getTimeColor = (time: number) => {
    if (time < 200) return 'text-neon-green';
    if (time < 300) return 'text-neon-cyan';
    if (time < 400) return 'text-neon-yellow';
    return 'text-neon-orange';
  };

  const getMessage = (time: number) => {
    if (time < 150) return 'SUPERHUMAN! 🚀';
    if (time < 200) return 'INCREDIBLE! ⚡';
    if (time < 250) return 'FAST! 🔥';
    if (time < 300) return 'GOOD! 👍';
    if (time < 400) return 'AVERAGE';
    return 'KEEP PRACTICING';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Faster green, -100ms bonus!
        </div>
      )}

      {bestTime && (
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30 text-center">
          <p className="text-xs text-muted-foreground font-display">BEST TIME</p>
          <p className="text-2xl font-bold text-neon-yellow">{bestTime}ms</p>
        </div>
      )}

      <button
        onClick={handleClick}
        className={`
          w-80 h-80 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center
          border-4 cursor-pointer
          ${gameState === 'idle' ? 'bg-neon-cyan/20 border-neon-cyan hover:bg-neon-cyan/30' : ''}
          ${gameState === 'waiting' ? 'bg-destructive/20 border-destructive' : ''}
          ${gameState === 'ready' ? 'bg-neon-green/30 border-neon-green shadow-[0_0_50px_hsl(150,100%,50%,0.4)]' : ''}
          ${gameState === 'result' ? 'bg-neon-purple/20 border-neon-purple' : ''}
          ${gameState === 'tooearly' ? 'bg-destructive/20 border-destructive' : ''}
        `}
      >
        {gameState === 'idle' && (
          <>
            <Zap className="w-16 h-16 text-neon-cyan mb-4" />
            <p className="text-2xl font-display text-foreground">Click to Start</p>
            <p className="text-sm text-muted-foreground mt-2">Test your reaction time!</p>
          </>
        )}

        {gameState === 'waiting' && (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/50 mb-4" />
            <p className="text-2xl font-display text-destructive">Wait for green...</p>
            <p className="text-sm text-muted-foreground mt-2">Do not click yet!</p>
          </>
        )}

        {gameState === 'ready' && (
          <>
            <div className="w-16 h-16 rounded-full bg-neon-green animate-pulse mb-4" />
            <p className="text-3xl font-display text-neon-green neon-text">CLICK NOW!</p>
          </>
        )}

        {gameState === 'result' && reactionTime && (
          <>
            <p className={`text-5xl font-display font-bold ${getTimeColor(reactionTime)}`}>
              {reactionTime}ms
            </p>
            <p className="text-xl font-display text-foreground mt-2">{getMessage(reactionTime)}</p>
            <p className="text-sm text-muted-foreground mt-4">Click to try again</p>
          </>
        )}

        {gameState === 'tooearly' && (
          <>
            <p className="text-2xl font-display text-destructive">Too early!</p>
            <p className="text-sm text-muted-foreground mt-2">Click to try again</p>
          </>
        )}
      </button>

      {(gameState === 'result' || gameState === 'tooearly') && (
        <Button onClick={startGame} variant="outline" className="gap-2 border-primary/30">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
