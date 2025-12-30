import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const COLORS = ['red', 'blue', 'green', 'yellow'];

export function SimonSays() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'gameover'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const colorClasses = [
    'bg-red-500 hover:bg-red-400 shadow-[0_0_30px_hsl(0,70%,50%,0.5)]',
    'bg-blue-500 hover:bg-blue-400 shadow-[0_0_30px_hsl(220,70%,50%,0.5)]',
    'bg-green-500 hover:bg-green-400 shadow-[0_0_30px_hsl(120,70%,40%,0.5)]',
    'bg-yellow-500 hover:bg-yellow-400 shadow-[0_0_30px_hsl(50,70%,50%,0.5)]',
  ];

  const activeClasses = [
    'bg-red-300 scale-105',
    'bg-blue-300 scale-105',
    'bg-green-300 scale-105',
    'bg-yellow-300 scale-105',
  ];

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    setSequence(prev => [...prev, newColor]);
  }, []);

  const startGame = () => {
    setSequence([]);
    setPlayerIndex(0);
    setScore(0);
    addToSequence();
    setGameState('showing');
  };

  // Show sequence
  useEffect(() => {
    if (gameState !== 'showing') return;

    let i = 0;
    const showNext = () => {
      if (i >= sequence.length) {
        setActiveColor(null);
        setGameState('playing');
        setPlayerIndex(0);
        return;
      }

      setActiveColor(sequence[i]);
      // Admin: slower sequence, easier to follow
      const displayTime = isAdmin ? 800 : 500;
      const gapTime = isAdmin ? 400 : 200;
      
      setTimeout(() => {
        setActiveColor(null);
        setTimeout(() => {
          i++;
          showNext();
        }, gapTime);
      }, displayTime);
    };

    const timer = setTimeout(showNext, 500);
    return () => clearTimeout(timer);
  }, [gameState, sequence, isAdmin]);

  const handleColorClick = (colorIndex: number) => {
    if (gameState !== 'playing') return;

    setActiveColor(colorIndex);
    setTimeout(() => setActiveColor(null), 200);

    // Admin cheat: any color is correct
    const isCorrect = isAdmin || colorIndex === sequence[playerIndex];

    if (isCorrect) {
      if (playerIndex === sequence.length - 1) {
        setScore(prev => prev + 1);
        setPlayerIndex(0);
        addToSequence();
        setGameState('showing');
      } else {
        setPlayerIndex(prev => prev + 1);
      }
    } else {
      if (score > highScore) setHighScore(score);
      setGameState('gameover');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Any color is correct!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-purple/30">
          <p className="text-xs text-muted-foreground font-display">ROUND</p>
          <p className="text-2xl font-bold text-neon-purple">{score + 1}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
          <p className="text-xs text-muted-foreground font-display">BEST</p>
          <p className="text-2xl font-bold text-neon-yellow">{highScore}</p>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-4 p-6 glass-card rounded-xl border border-primary/30">
          {COLORS.map((_, index) => (
            <button
              key={index}
              onClick={() => handleColorClick(index)}
              disabled={gameState !== 'playing'}
              className={`
                w-28 h-28 md:w-36 md:h-36 rounded-xl transition-all duration-150
                ${activeColor === index ? activeClasses[index] : colorClasses[index]}
                ${gameState !== 'playing' ? 'opacity-50' : ''}
              `}
            />
          ))}
        </div>

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">SIMON SAYS</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'showing' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xl font-display text-primary animate-pulse">Watch the pattern...</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className="text-2xl font-display text-destructive neon-text mb-2">WRONG!</h3>
            <p className="text-xl font-display text-foreground mb-4">Rounds: {score}</p>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <p className="text-muted-foreground">Your turn! ({playerIndex + 1}/{sequence.length})</p>
      )}
    </div>
  );
}
