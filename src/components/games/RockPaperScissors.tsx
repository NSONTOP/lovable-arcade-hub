import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Hand, Scissors, FileText } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

const choices: Choice[] = ['rock', 'paper', 'scissors'];

const choiceIcons = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};

export function RockPaperScissors() {
  const { isAdmin } = useAdmin();
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const getWinner = (player: Choice, ai: Choice): Result => {
    if (player === ai) return 'draw';
    if (
      (player === 'rock' && ai === 'scissors') ||
      (player === 'paper' && ai === 'rock') ||
      (player === 'scissors' && ai === 'paper')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const getLosingChoice = (player: Choice): Choice => {
    if (player === 'rock') return 'scissors';
    if (player === 'paper') return 'rock';
    return 'paper';
  };

  const play = (choice: Choice) => {
    setIsAnimating(true);
    setPlayerChoice(choice);
    setAiChoice(null);
    setResult(null);

    setTimeout(() => {
      // Admin cheat: AI always picks the losing choice
      const ai = isAdmin ? getLosingChoice(choice) : choices[Math.floor(Math.random() * 3)];
      setAiChoice(ai);
      
      const gameResult = getWinner(choice, ai);
      setResult(gameResult);
      
      setScores(prev => ({
        player: prev.player + (gameResult === 'win' ? 1 : 0),
        ai: prev.ai + (gameResult === 'lose' ? 1 : 0),
        draws: prev.draws + (gameResult === 'draw' ? 1 : 0),
      }));
      
      setIsAnimating(false);
    }, 1000);
  };

  const reset = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setScores({ player: 0, ai: 0, draws: 0 });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: You always win!
        </div>
      )}

      <div className="flex items-center gap-6 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">YOU</p>
          <p className="text-2xl font-bold text-neon-cyan">{scores.player}</p>
        </div>
        <div className="glass-card px-4 py-3 rounded-lg border border-muted/30">
          <p className="text-xs text-muted-foreground font-display">DRAW</p>
          <p className="text-2xl font-bold text-muted-foreground">{scores.draws}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-magenta/30">
          <p className="text-xs text-muted-foreground font-display">AI</p>
          <p className="text-2xl font-bold text-neon-magenta">{scores.ai}</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-xl border border-primary/30">
        {/* Battle area */}
        <div className="flex items-center justify-center gap-12 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-display mb-2">YOU</p>
            <div className={`
              w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-5xl
              ${isAnimating ? 'animate-bounce' : ''}
              ${result === 'win' ? 'ring-4 ring-neon-green' : ''}
              ${result === 'lose' ? 'ring-4 ring-destructive' : ''}
            `}>
              {playerChoice ? choiceIcons[playerChoice] : '❓'}
            </div>
          </div>

          <div className="text-3xl font-display text-primary">VS</div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground font-display mb-2">AI</p>
            <div className={`
              w-24 h-24 rounded-2xl bg-muted flex items-center justify-center text-5xl
              ${isAnimating ? 'animate-bounce' : ''}
              ${result === 'lose' ? 'ring-4 ring-neon-green' : ''}
              ${result === 'win' ? 'ring-4 ring-destructive' : ''}
            `}>
              {aiChoice ? choiceIcons[aiChoice] : (isAnimating ? '🤔' : '❓')}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`
            text-center py-4 rounded-lg mb-6
            ${result === 'win' ? 'bg-neon-green/20 text-neon-green' : ''}
            ${result === 'lose' ? 'bg-destructive/20 text-destructive' : ''}
            ${result === 'draw' ? 'bg-muted text-muted-foreground' : ''}
          `}>
            <p className="text-2xl font-display">
              {result === 'win' && 'YOU WIN! 🎉'}
              {result === 'lose' && 'YOU LOSE! 😢'}
              {result === 'draw' && "IT'S A DRAW! 🤝"}
            </p>
          </div>
        )}

        {/* Choice buttons */}
        <div className="flex justify-center gap-4">
          {choices.map(choice => (
            <button
              key={choice}
              onClick={() => play(choice)}
              disabled={isAnimating}
              className={`
                w-20 h-20 rounded-xl bg-muted border-2 border-primary/30 
                hover:border-primary hover:bg-muted/80 transition-all duration-200
                flex items-center justify-center text-4xl
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-110
              `}
            >
              {choiceIcons[choice]}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={reset} variant="outline" className="gap-2 border-primary/30">
        <RotateCcw className="w-4 h-4" />
        Reset Score
      </Button>
    </div>
  );
}
