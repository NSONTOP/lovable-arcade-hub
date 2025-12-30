import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const PIPE_SPEED = 3;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export function FlappyBird() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameState]);

  const startGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'gameover') {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, jump]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Update bird position
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        // Admin cheat: can't fall below a certain point
        if (isAdmin && newY > GAME_HEIGHT - BIRD_SIZE - 50) {
          return GAME_HEIGHT - BIRD_SIZE - 50;
        }
        return newY;
      });
      setBirdVelocity(prev => prev + GRAVITY);

      // Update pipes
      setPipes(prev => {
        let newPipes = prev
          .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          const gapPosition = isAdmin
            ? birdY - PIPE_GAP / 2 + Math.random() * 20 - 10 // Admin: pipe follows bird
            : 100 + Math.random() * (GAME_HEIGHT - 200 - PIPE_GAP);
          newPipes.push({
            x: GAME_WIDTH,
            topHeight: Math.max(50, Math.min(gapPosition, GAME_HEIGHT - PIPE_GAP - 50)),
            passed: false,
          });
        }

        return newPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, birdVelocity, isAdmin]);

  // Check collisions and score
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Check ground/ceiling collision (admin is immune)
    if (!isAdmin && (birdY < 0 || birdY > GAME_HEIGHT - BIRD_SIZE)) {
      setGameState('gameover');
      if (score > highScore) setHighScore(score);
      return;
    }

    // Check pipe collisions
    const birdLeft = 80;
    const birdRight = birdLeft + BIRD_SIZE;
    const birdTop = birdY;
    const birdBottom = birdY + BIRD_SIZE;

    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      const gapTop = pipe.topHeight;
      const gapBottom = pipe.topHeight + PIPE_GAP;

      // Check if bird is in pipe x range
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Admin cheat: much smaller collision box
        const collisionMargin = isAdmin ? 25 : 0;
        if (birdTop + collisionMargin < gapTop || birdBottom - collisionMargin > gapBottom) {
          if (!isAdmin) {
            setGameState('gameover');
            if (score > highScore) setHighScore(score);
            return;
          }
        }
      }

      // Score point
      if (!pipe.passed && pipe.x + PIPE_WIDTH < birdLeft) {
        setPipes(prev => prev.map(p => p === pipe ? { ...p, passed: true } : p));
        setScore(prev => prev + 1);
      }
    }
  }, [birdY, pipes, gameState, score, highScore, isAdmin]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Pipes follow you & reduced collision!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-green/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-green">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
          <p className="text-xs text-muted-foreground font-display">BEST</p>
          <p className="text-2xl font-bold text-neon-yellow">{highScore}</p>
        </div>
      </div>

      <div
        ref={containerRef}
        onClick={gameState === 'playing' ? jump : startGame}
        className="relative overflow-hidden rounded-xl border-2 border-primary/30 cursor-pointer"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)' }}
      >
        {/* Stars background */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Bird */}
        <div
          className="absolute transition-transform duration-75"
          style={{
            left: 80,
            top: birdY,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
          }}
        >
          <div className="w-full h-full rounded-full bg-neon-cyan border-2 border-primary shadow-[0_0_15px_hsl(180,100%,50%,0.5)]" />
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-gradient-to-b from-neon-green/80 to-neon-green/40 border-2 border-neon-green/50 rounded-b-lg"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.topHeight,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-gradient-to-t from-neon-green/80 to-neon-green/40 border-2 border-neon-green/50 rounded-t-lg"
              style={{
                left: pipe.x,
                top: pipe.topHeight + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
              }}
            />
          </div>
        ))}

        {/* Game states overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">FLAPPY BIRD</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Press SPACE or Click to jump</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className="text-2xl font-display text-destructive neon-text mb-2">GAME OVER</h3>
            <p className="text-xl font-display text-foreground mb-4">Score: {score}</p>
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
