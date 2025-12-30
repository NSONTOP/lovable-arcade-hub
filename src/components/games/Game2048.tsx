import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 4;

type Grid = (number | null)[][];

const createEmptyGrid = (): Grid => 
  Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-amber-100 text-amber-900',
    4: 'bg-amber-200 text-amber-900',
    8: 'bg-orange-300 text-orange-900',
    16: 'bg-orange-400 text-white',
    32: 'bg-orange-500 text-white',
    64: 'bg-orange-600 text-white',
    128: 'bg-yellow-400 text-yellow-900',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-600 text-white',
    1024: 'bg-green-500 text-white',
    2048: 'bg-neon-cyan text-background',
  };
  return colors[value] || 'bg-neon-purple text-white';
};

export function Game2048() {
  const { isAdmin } = useAdmin();
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const addRandomTile = useCallback((currentGrid: Grid): Grid => {
    const newGrid = currentGrid.map(row => [...row]);
    const empty: [number, number][] = [];
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!newGrid[i][j]) empty.push([i, j]);
      }
    }
    
    if (empty.length > 0) {
      const [row, col] = empty[Math.floor(Math.random() * empty.length)];
      // Admin: always spawn 4s
      newGrid[row][col] = isAdmin ? 4 : (Math.random() < 0.9 ? 2 : 4);
    }
    
    return newGrid;
  }, [isAdmin]);

  const initGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, []);

  const canMove = (currentGrid: Grid): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!currentGrid[i][j]) return true;
        if (j < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i][j + 1]) return true;
        if (i < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i + 1][j]) return true;
      }
    }
    return false;
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let addedScore = 0;

    const moveRow = (row: (number | null)[]): (number | null)[] => {
      const filtered = row.filter(x => x !== null) as number[];
      const merged: number[] = [];
      
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2;
          merged.push(mergedValue);
          addedScore += mergedValue;
          if (mergedValue === 2048 && !won) setWon(true);
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }
      
      while (merged.length < GRID_SIZE) merged.push(null as any);
      return merged;
    };

    if (direction === 'left') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const newRow = moveRow(newGrid[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const reversed = [...newGrid[i]].reverse();
        const newRow = moveRow(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const col = newGrid.map(row => row[j]);
        const newCol = moveRow(col);
        if (JSON.stringify(newCol) !== JSON.stringify(col)) moved = true;
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newCol[i];
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const col = newGrid.map(row => row[j]).reverse();
        const newCol = moveRow(col).reverse();
        const originalCol = newGrid.map(row => row[j]);
        if (JSON.stringify(newCol) !== JSON.stringify(originalCol)) moved = true;
        for (let i = 0; i < GRID_SIZE; i++) {
          newGrid[i][j] = newCol[i];
        }
      }
    }

    if (moved) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      const newScore = score + addedScore;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);
      
      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver, score, bestScore, won, addRandomTile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right';
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: Always spawn 4s!
        </div>
      )}

      <div className="flex items-center gap-6 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">SCORE</p>
          <p className="text-2xl font-bold text-neon-cyan">{score}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
          <p className="text-xs text-muted-foreground font-display">BEST</p>
          <p className="text-2xl font-bold text-neon-yellow">{bestScore}</p>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2 p-4 bg-muted rounded-xl">
          {grid.flat().map((value, index) => (
            <div
              key={index}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center
                font-display font-bold text-xl md:text-2xl transition-all duration-100
                ${value ? getTileColor(value) : 'bg-muted-foreground/20'}
              `}
            >
              {value}
            </div>
          ))}
        </div>

        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <Trophy className="w-12 h-12 text-neon-yellow mb-4" />
            <h3 className={`text-2xl font-display neon-text mb-2 ${won ? 'text-neon-green' : 'text-destructive'}`}>
              {won ? 'YOU WIN!' : 'GAME OVER'}
            </h3>
            <p className="text-xl font-display text-foreground mb-4">Score: {score}</p>
            <Button onClick={initGame} className="gap-2 bg-primary hover:bg-primary/80">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        <p>Use arrow keys to move tiles</p>
        <p>Merge same numbers to reach 2048!</p>
      </div>

      <Button onClick={initGame} variant="outline" className="gap-2 border-primary/30">
        <RotateCcw className="w-4 h-4" />
        New Game
      </Button>
    </div>
  );
}
