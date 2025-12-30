import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export function SnakeGame() {
  const { isAdmin } = useAdmin();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const startGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameState('playing');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Admin cheat: wrap around walls instead of dying
      if (isAdmin) {
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
      } else {
        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState('gameover');
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }
      }

      // Check self collision (admin is immune)
      if (!isAdmin && prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameover');
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, isAdmin, score, highScore]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    gameLoopRef.current = setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, moveSnake, score]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'idle' || gameState === 'gameover') {
        if (e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      const currentDir = directionRef.current;
      let newDirection: Direction | null = null;

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          if (currentDir !== 'DOWN') newDirection = 'UP';
          break;
        case 'ArrowDown':
        case 'KeyS':
          if (currentDir !== 'UP') newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'KeyA':
          if (currentDir !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'KeyD':
          if (currentDir !== 'LEFT') newDirection = 'RIGHT';
          break;
      }

      if (newDirection) {
        e.preventDefault();
        directionRef.current = newDirection;
        setDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Can't die! Walls wrap around.
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-magenta">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
          <p className="text-xs text-muted-foreground font-display">BEST</p>
          <p className="text-2xl font-bold text-neon-yellow">{highScore}</p>
        </div>
      </div>

      <div
        className="relative rounded-xl border-2 border-primary/30 overflow-hidden"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%)'
        }}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.05) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm transition-all duration-75 ${
              index === 0 
                ? 'bg-neon-magenta shadow-[0_0_10px_hsl(300,100%,60%,0.5)]' 
                : 'bg-neon-magenta/70'
            }`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              margin: 1,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute rounded-full bg-neon-green shadow-[0_0_15px_hsl(150,100%,50%,0.5)] animate-pulse"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            margin: 1,
          }}
        />

        {/* Game states overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <h3 className="text-2xl font-display text-primary neon-text mb-4">SNAKE</h3>
            <Button onClick={startGame} className="gap-2 bg-primary hover:bg-primary/80">
              <Play className="w-4 h-4" />
              Start Game
            </Button>
            <p className="text-sm text-muted-foreground mt-4">Use Arrow Keys or WASD</p>
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

      <div className="flex gap-2">
        <div className="glass-card p-2 rounded border border-primary/20">
          <p className="text-xs text-muted-foreground text-center">↑ W</p>
        </div>
      </div>
      <div className="flex gap-2 -mt-4">
        <div className="glass-card p-2 rounded border border-primary/20">
          <p className="text-xs text-muted-foreground">← A</p>
        </div>
        <div className="glass-card p-2 rounded border border-primary/20">
          <p className="text-xs text-muted-foreground">↓ S</p>
        </div>
        <div className="glass-card p-2 rounded border border-primary/20">
          <p className="text-xs text-muted-foreground">→ D</p>
        </div>
      </div>
    </div>
  );
}
