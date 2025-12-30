import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const COLORS = [
  { name: 'RED', color: '#ef4444' },
  { name: 'BLUE', color: '#3b82f6' },
  { name: 'GREEN', color: '#22c55e' },
  { name: 'YELLOW', color: '#eab308' },
  { name: 'PURPLE', color: '#a855f7' },
  { name: 'ORANGE', color: '#f97316' },
];

const GAME_DURATION = 30;

export function ColorMatch() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [displayWord, setDisplayWord] = useState('');
  const [displayColor, setDisplayColor] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [highScore, setHighScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    setDisplayWord(COLORS[wordIndex].name);
    setDisplayColor(COLORS[colorIndex].color);
  }, []);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_DURATION);
    generateRound();
    setGameState('playing');
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

  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
    }
  }, [gameState, score, highScore]);

  const handleAnswer = (matches: boolean) => {
    if (gameState !== 'playing') return;

    const actualColor = COLORS.find(c => c.color === displayColor)?.name;
    const isMatch = displayWord === actualColor;
    const isCorrect = isAdmin || (matches === isMatch);

    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setShowFeedback('correct');
    } else {
      setStreak(0);
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback(null);
      generateRound();
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: All answers are correct!
        </div>
      )}

      <div className="flex items-center gap-6 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-cyan">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-green/30">
          <p className="text-xs text-muted-foreground font-display">STREAK</p>
          <p className="text-2xl font-bold text-neon-green">{streak}🔥</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">TIME</p>
          <p className="text-2xl font-bold text-neon-magenta">{timeLeft}s</p>
        </div>
      </div>

      <div className="relative">
        <div className="glass-card p-12 rounded-xl border border-primary/30 text-center min-w-[350px]">
          {gameState === 'playing' && (
            <>
              <p className="text-sm text-muted-foreground mb-4 font-display">
                Does the WORD match the COLOR?
              </p>
              
              <div 
                className={`
                  text-6xl font-display font-bold mb-8 transition-all duration-100
                  ${showFeedback === 'correct' ? 'scale-110' : ''}
                  ${showFeedback === 'wrong' ? 'shake' : ''}
                `}
                style={{ color: displayColor }}
              >
                {displayWord}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="w-32 h-16 text-xl font-display bg-neon-green hover:bg-neon-green/80 text-background"
                >
                  MATCH ✓
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  className="w-32 h-16 text-xl font-display bg-destructive hover:bg-destructive/80"
                >
                  NO ✗
                </Button>
              </div>
            </>
          )}
        </div>

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <h3 className="text-2xl font-display text-primary neon-text mb-2">COLOR MATCH</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center px-4">
              Does the word match the color it is displayed in?
            </p>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className="text-2xl font-display text-neon-cyan neon-text mb-2">TIME UP!</h3>
            <p className="text-xl font-display text-foreground mb-1">Score: {score}</p>
            <p className="text-sm text-muted-foreground mb-4">Best: {highScore}</p>
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
