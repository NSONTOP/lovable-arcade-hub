import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;
const WIN_SCORE = 5;

export function PongGame() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballPos, setBallPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [ballVel, setBallVel] = useState({ x: INITIAL_BALL_SPEED, y: INITIAL_BALL_SPEED });
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>();

  const resetBall = useCallback((direction: number) => {
    setBallPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setBallVel({ x: INITIAL_BALL_SPEED * direction, y: (Math.random() - 0.5) * INITIAL_BALL_SPEED * 2 });
  }, []);

  const startGame = () => {
    setPlayerY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setScores({ player: 0, ai: 0 });
    setWinner(null);
    resetBall(1);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (e.code === 'Space' && gameState !== 'playing') {
        startGame();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Player movement
      setPlayerY(prev => {
        let newY = prev;
        if (keysRef.current.has('ArrowUp') || keysRef.current.has('KeyW')) {
          newY = Math.max(0, prev - PADDLE_SPEED);
        }
        if (keysRef.current.has('ArrowDown') || keysRef.current.has('KeyS')) {
          newY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prev + PADDLE_SPEED);
        }
        return newY;
      });

      // AI movement (admin mode: AI is slow and dumb)
      setAiY(prev => {
        const aiSpeed = isAdmin ? 2 : 5;
        const targetY = ballPos.y - PADDLE_HEIGHT / 2;
        const diff = targetY - prev;
        
        if (isAdmin) {
          // Admin: AI reacts late and moves slowly
          if (Math.abs(diff) > 50) {
            return prev + Math.sign(diff) * aiSpeed;
          }
          return prev;
        }
        
        if (Math.abs(diff) > aiSpeed) {
          return prev + Math.sign(diff) * aiSpeed;
        }
        return targetY;
      });

      // Ball movement
      setBallPos(prev => {
        let newX = prev.x + ballVel.x;
        let newY = prev.y + ballVel.y;

        // Top/bottom bounce
        if (newY <= 0 || newY >= GAME_HEIGHT - BALL_SIZE) {
          setBallVel(v => ({ ...v, y: -v.y }));
          newY = Math.max(0, Math.min(GAME_HEIGHT - BALL_SIZE, newY));
        }

        // Paddle collision
        // Player paddle
        if (newX <= 30 + PADDLE_WIDTH && 
            newY + BALL_SIZE >= playerY && 
            newY <= playerY + PADDLE_HEIGHT &&
            ballVel.x < 0) {
          setBallVel(v => ({ x: -v.x * 1.05, y: v.y + (Math.random() - 0.5) * 2 }));
          newX = 30 + PADDLE_WIDTH;
        }

        // AI paddle
        if (newX >= GAME_WIDTH - 30 - PADDLE_WIDTH - BALL_SIZE && 
            newY + BALL_SIZE >= aiY && 
            newY <= aiY + PADDLE_HEIGHT &&
            ballVel.x > 0) {
          setBallVel(v => ({ x: -v.x * 1.05, y: v.y + (Math.random() - 0.5) * 2 }));
          newX = GAME_WIDTH - 30 - PADDLE_WIDTH - BALL_SIZE;
        }

        // Score
        if (newX < 0) {
          setScores(s => {
            const newScore = { ...s, ai: s.ai + 1 };
            if (newScore.ai >= WIN_SCORE) {
              setWinner('ai');
              setGameState('gameover');
            }
            return newScore;
          });
          resetBall(-1);
          return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
        }

        if (newX > GAME_WIDTH) {
          setScores(s => {
            const newScore = { ...s, player: s.player + 1 };
            if (newScore.player >= WIN_SCORE) {
              setWinner('player');
              setGameState('gameover');
            }
            return newScore;
          });
          resetBall(1);
          return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 };
        }

        return { x: newX, y: newY };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, ballVel, playerY, aiY, isAdmin, resetBall, ballPos.y]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: AI is slow and stupid!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">YOU</p>
          <p className="text-2xl font-bold text-neon-cyan">{scores.player}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">AI</p>
          <p className="text-2xl font-bold text-neon-magenta">{scores.ai}</p>
        </div>
      </div>

      <div
        className="relative rounded-xl border-2 border-primary/30 overflow-hidden"
        style={{ 
          width: GAME_WIDTH, 
          height: GAME_HEIGHT,
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)'
        }}
      >
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-primary/20" />

        {/* Player paddle */}
        <div
          className="absolute bg-neon-cyan rounded shadow-[0_0_15px_hsl(180,100%,50%,0.5)]"
          style={{
            left: 30,
            top: playerY,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />

        {/* AI paddle */}
        <div
          className="absolute bg-neon-magenta rounded shadow-[0_0_15px_hsl(300,100%,60%,0.5)]"
          style={{
            right: 30,
            top: aiY,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        />

        {/* Ball */}
        <div
          className="absolute bg-foreground rounded-full shadow-[0_0_20px_hsl(0,0%,100%,0.5)]"
          style={{
            left: ballPos.x,
            top: ballPos.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">PONG</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Use Arrow Keys or W/S</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className={`text-2xl font-display neon-text mb-2 ${winner === 'player' ? 'text-neon-cyan' : 'text-destructive'}`}>
              {winner === 'player' ? 'YOU WIN!' : 'AI WINS!'}
            </h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">First to {WIN_SCORE} wins!</p>
    </div>
  );
}
