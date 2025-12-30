import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';

type Player = 'X' | 'O' | null;
type Board = Player[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

export function TicTacToe() {
  const { isAdmin } = useAdmin();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });

  const checkWinner = (currentBoard: Board): { winner: Player; line: number[] } | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    return null;
  };

  const getAvailableMoves = (currentBoard: Board): number[] => {
    return currentBoard.reduce<number[]>((acc, cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, []);
  };

  const minimax = (currentBoard: Board, isMaximizing: boolean): number => {
    const result = checkWinner(currentBoard);
    if (result) return result.winner === 'O' ? 10 : -10;
    if (getAvailableMoves(currentBoard).length === 0) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (const move of getAvailableMoves(currentBoard)) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        best = Math.max(best, minimax(newBoard, false));
      }
      return best;
    } else {
      let best = Infinity;
      for (const move of getAvailableMoves(currentBoard)) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'X';
        best = Math.min(best, minimax(newBoard, true));
      }
      return best;
    }
  };

  const getBestMove = (currentBoard: Board): number => {
    // Admin cheat: AI makes bad moves
    if (isAdmin) {
      const available = getAvailableMoves(currentBoard);
      // Find a non-winning, non-blocking move
      for (const move of available) {
        const testBoard = [...currentBoard];
        testBoard[move] = 'O';
        if (!checkWinner(testBoard)) {
          // Check if this blocks player
          const playerTestBoard = [...currentBoard];
          playerTestBoard[move] = 'X';
          if (!checkWinner(playerTestBoard)) {
            return move; // Safe losing move
          }
        }
      }
      return available[0];
    }

    let bestScore = -Infinity;
    let bestMove = 0;

    for (const move of getAvailableMoves(currentBoard)) {
      const newBoard = [...currentBoard];
      newBoard[move] = 'O';
      const score = minimax(newBoard, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      toast.success('🎉 You win!');
      return;
    }

    if (getAvailableMoves(newBoard).length === 0) {
      setWinner('draw');
      toast.info("It's a draw!");
      return;
    }

    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const aiMove = getBestMove(newBoard);
        newBoard[aiMove] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          setWinner(result.winner);
          setWinningLine(result.line);
          setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
          toast.error('AI wins!');
        } else if (getAvailableMoves(newBoard).length === 0) {
          setWinner('draw');
          toast.info("It's a draw!");
        }

        setIsPlayerTurn(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: AI will make mistakes!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">YOU (X)</p>
          <p className="text-2xl font-bold text-neon-cyan">{scores.player}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">AI (O)</p>
          <p className="text-2xl font-bold text-neon-magenta">{scores.ai}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 glass-card rounded-xl border border-primary/30">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`
              w-20 h-20 md:w-24 md:h-24 rounded-lg text-4xl font-display font-bold
              transition-all duration-200 border-2
              ${cell === 'X' ? 'text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10' : ''}
              ${cell === 'O' ? 'text-neon-magenta border-neon-magenta/50 bg-neon-magenta/10' : ''}
              ${!cell ? 'border-primary/20 bg-muted hover:border-primary/50 hover:bg-muted/80' : ''}
              ${winningLine?.includes(index) ? 'animate-pulse-glow scale-105' : ''}
              disabled:cursor-not-allowed
            `}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-display">
            {winner === 'X' && (
              <>
                <Trophy className="w-6 h-6 text-neon-yellow" />
                <span className="text-neon-cyan">You Win!</span>
              </>
            )}
            {winner === 'O' && <span className="text-neon-magenta">AI Wins!</span>}
            {winner === 'draw' && <span className="text-muted-foreground">Draw!</span>}
          </div>
          <Button onClick={resetGame} className="gap-2 bg-primary hover:bg-primary/80">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </div>
      )}

      {!winner && (
        <p className="text-muted-foreground font-body">
          {isPlayerTurn ? "Your turn (X)" : "AI is thinking..."}
        </p>
      )}
    </div>
  );
}
