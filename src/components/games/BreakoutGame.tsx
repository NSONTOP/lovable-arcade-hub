import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 10;
const BRICK_ROWS = 4;
const BRICK_COLS = 8;
const BRICK_WIDTH = 55;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 4;

interface Brick {
  x: number;
  y: number;
  active: boolean;
  color: string;
}

export function BreakoutGame() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ballPos, setBallPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [ballVel, setBallVel] = useState({ x: 4, y: -4 });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameLoopRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = ['#22d3ee', '#f472b6', '#a78bfa', '#4ade80', '#fbbf24'];

  const initBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    const startX = (GAME_WIDTH - (BRICK_COLS * (BRICK_WIDTH + BRICK_GAP))) / 2;
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: startX + col * (BRICK_WIDTH + BRICK_GAP),
          y: 40 + row * (BRICK_HEIGHT + BRICK_GAP),
          active: true,
          color: colors[row % colors.length],
        });
      }
    }
    return newBricks;
  }, []);

  const startGame = () => {
    setBricks(initBricks());
    setPaddleX(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBallPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setBallVel({ x: 4, y: -4 });
    setScore(0);
    setLives(isAdmin ? 99 : 3);
    setGameState('playing');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || gameState !== 'playing') return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - PADDLE_WIDTH / 2;
      setPaddleX(Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setBallPos(prev => {
        let newX = prev.x + ballVel.x;
        let newY = prev.y + ballVel.y;

        // Wall bounces
        if (newX <= 0 || newX >= GAME_WIDTH - BALL_SIZE) {
          setBallVel(v => ({ ...v, x: -v.x }));
          newX = Math.max(0, Math.min(GAME_WIDTH - BALL_SIZE, newX));
        }
        if (newY <= 0) {
          setBallVel(v => ({ ...v, y: -v.y }));
          newY = 0;
        }

        // Paddle collision
        if (newY >= GAME_HEIGHT - PADDLE_HEIGHT - 20 - BALL_SIZE &&
            newX + BALL_SIZE >= paddleX &&
            newX <= paddleX + PADDLE_WIDTH &&
            ballVel.y > 0) {
          const hitPos = (newX + BALL_SIZE / 2 - paddleX) / PADDLE_WIDTH;
          const angle = (hitPos - 0.5) * Math.PI / 3;
          const speed = Math.sqrt(ballVel.x ** 2 + ballVel.y ** 2);
          setBallVel({
            x: Math.sin(angle) * speed,
            y: -Math.abs(Math.cos(angle) * speed),
          });
          newY = GAME_HEIGHT - PADDLE_HEIGHT - 20 - BALL_SIZE;
        }

        // Ball falls
        if (newY > GAME_HEIGHT) {
          if (isAdmin) {
            // Admin: ball bounces back
            setBallVel(v => ({ ...v, y: -Math.abs(v.y) }));
            return { x: newX, y: GAME_HEIGHT - 10 };
          }
          
          setLives(l => {
            if (l <= 1) {
              setGameState('gameover');
              return 0;
            }
            setBallPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
            setBallVel({ x: 4, y: -4 });
            return l - 1;
          });
          return { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 };
        }

        // Brick collision
        setBricks(currentBricks => {
          let hitBrick = false;
          const newBricks = currentBricks.map(brick => {
            if (!brick.active) return brick;
            
            if (newX + BALL_SIZE > brick.x &&
                newX < brick.x + BRICK_WIDTH &&
                newY + BALL_SIZE > brick.y &&
                newY < brick.y + BRICK_HEIGHT) {
              hitBrick = true;
              setScore(s => s + 10);
              return { ...brick, active: false };
            }
            return brick;
          });
          
          if (hitBrick) {
            setBallVel(v => ({ ...v, y: -v.y }));
          }
          
          if (newBricks.every(b => !b.active)) {
            setGameState('won');
          }
          
          return newBricks;
        });

        return { x: newX, y: newY };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, ballVel, paddleX, isAdmin]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Infinite lives, ball never falls!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-cyan">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">LIVES</p>
          <p className="text-2xl font-bold text-neon-magenta">{lives}</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-xl border-2 border-primary/30 overflow-hidden cursor-none"
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)'
        }}
      >
        {/* Bricks */}
        {bricks.map((brick, index) => brick.active && (
          <div
            key={index}
            className="absolute rounded"
            style={{
              left: brick.x,
              top: brick.y,
              width: BRICK_WIDTH,
              height: BRICK_HEIGHT,
              backgroundColor: brick.color,
              boxShadow: `0 0 10px ${brick.color}50`,
            }}
          />
        ))}

        {/* Ball */}
        <div
          className="absolute rounded-full bg-foreground shadow-[0_0_15px_white]"
          style={{
            left: ballPos.x,
            top: ballPos.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
        />

        {/* Paddle */}
        <div
          className="absolute rounded bg-neon-cyan shadow-[0_0_20px_hsl(180,100%,50%,0.5)]"
          style={{
            left: paddleX,
            bottom: 20,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">BREAKOUT</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Move mouse to control paddle</p>
          </div>
        )}

        {(gameState === 'gameover' || gameState === 'won') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className={`text-2xl font-display neon-text mb-2 ${gameState === 'won' ? 'text-neon-green' : 'text-destructive'}`}>
              {gameState === 'won' ? 'YOU WIN!' : 'GAME OVER'}
            </h3>
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
