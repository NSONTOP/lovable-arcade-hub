import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, Check } from 'lucide-react';

export function NumberGuess() {
  const { isAdmin } = useAdmin();
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<{ value: number; hint: 'high' | 'low' | 'correct' }[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [bestScore, setBestScore] = useState<number | null>(null);

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) return;

    let hint: 'high' | 'low' | 'correct';
    
    // Admin cheat: if within 10, it's correct
    if (isAdmin && Math.abs(guessNum - targetNumber) <= 10) {
      hint = 'correct';
    } else if (guessNum === targetNumber) {
      hint = 'correct';
    } else if (guessNum > targetNumber) {
      hint = 'high';
    } else {
      hint = 'low';
    }

    setAttempts(prev => [...prev, { value: guessNum, hint }]);
    setGuess('');

    if (hint === 'correct') {
      setGameState('won');
      const score = attempts.length + 1;
      if (!bestScore || score < bestScore) {
        setBestScore(score);
      }
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttempts([]);
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Within 10 = Correct! (Target: {targetNumber})
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">ATTEMPTS</p>
          <p className="text-2xl font-bold text-neon-cyan">{attempts.length}</p>
        </div>
        {bestScore && (
          <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
            <p className="text-xs text-muted-foreground font-display">BEST</p>
            <p className="text-2xl font-bold text-neon-yellow">{bestScore}</p>
          </div>
        )}
      </div>

      <div className="glass-card p-8 rounded-xl border border-primary/30 min-w-[350px]">
        <h3 className="text-2xl font-display text-center text-foreground mb-2">
          Guess the Number
        </h3>
        <p className="text-center text-muted-foreground mb-6">Between 1 and 100</p>

        {gameState === 'playing' ? (
          <>
            <div className="flex gap-2 mb-6">
              <Input
                type="number"
                min="1"
                max="100"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                placeholder="Enter your guess..."
                className="text-center text-xl font-display bg-muted border-primary/30"
              />
              <Button onClick={handleGuess} className="bg-primary hover:bg-primary/80 px-6">
                Guess
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attempts.slice().reverse().map((attempt, index) => (
                <div
                  key={attempts.length - index}
                  className={`
                    flex items-center justify-between px-4 py-2 rounded-lg
                    ${attempt.hint === 'high' ? 'bg-destructive/20 text-destructive' : ''}
                    ${attempt.hint === 'low' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${attempt.hint === 'correct' ? 'bg-neon-green/20 text-neon-green' : ''}
                  `}
                >
                  <span className="font-display text-xl">{attempt.value}</span>
                  <span className="flex items-center gap-1 text-sm">
                    {attempt.hint === 'high' && (
                      <>
                        <ArrowDown className="w-4 h-4" />
                        Too High
                      </>
                    )}
                    {attempt.hint === 'low' && (
                      <>
                        <ArrowUp className="w-4 h-4" />
                        Too Low
                      </>
                    )}
                    {attempt.hint === 'correct' && (
                      <>
                        <Check className="w-4 h-4" />
                        Correct!
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
            <h3 className="text-2xl font-display text-neon-green neon-text mb-2">
              YOU GOT IT!
            </h3>
            <p className="text-xl font-display text-foreground mb-1">
              The number was {targetNumber}
            </p>
            <p className="text-muted-foreground mb-6">
              Found in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!
            </p>
            <Button onClick={resetGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <Button onClick={resetGame} variant="outline" className="gap-2 border-primary/30">
          <RotateCcw className="w-4 h-4" />
          New Number
        </Button>
      )}
    </div>
  );
}
