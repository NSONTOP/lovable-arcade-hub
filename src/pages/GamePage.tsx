import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TicTacToe } from '@/components/games/TicTacToe';
import { FlappyBird } from '@/components/games/FlappyBird';
import { MemoryMatch } from '@/components/games/MemoryMatch';
import { SnakeGame } from '@/components/games/SnakeGame';
import { PongGame } from '@/components/games/PongGame';
import { WhackAMole } from '@/components/games/WhackAMole';
import { SimonSays } from '@/components/games/SimonSays';
import { ReactionTime } from '@/components/games/ReactionTime';
import { RockPaperScissors } from '@/components/games/RockPaperScissors';
import { Game2048 } from '@/components/games/Game2048';
import { BreakoutGame } from '@/components/games/BreakoutGame';
import { ColorMatch } from '@/components/games/ColorMatch';
import { NumberGuess } from '@/components/games/NumberGuess';
import { TypingSpeed } from '@/components/games/TypingSpeed';
import { games } from '@/data/games';

const gameComponents: Record<string, React.FC> = {
  'tic-tac-toe': TicTacToe,
  'flappy-bird': FlappyBird,
  'memory-match': MemoryMatch,
  'snake': SnakeGame,
  'air-hockey': PongGame,
  'target-shooter': WhackAMole,
  'magic-sparkles': SimonSays,
  'speed-run': ReactionTime,
  'dice-roll': RockPaperScissors,
  'puzzle-blocks': Game2048,
  'bomb-defuser': BreakoutGame,
  'color-match': ColorMatch,
  'math-quiz': NumberGuess,
  'rhythm-game': TypingSpeed,
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = games.find(g => g.id === gameId);
  const GameComponent = gameId ? gameComponents[gameId] : null;

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen cyber-grid">
        <Header />
        <main className="pt-24 pb-12 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">Game Not Found</h1>
            <p className="text-muted-foreground mb-8">This game doesn't exist or is coming soon!</p>
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Games
          </Link>
          <h1 className="text-4xl font-display font-bold text-foreground neon-text">{game.title}</h1>
          <p className="text-muted-foreground mt-2">{game.description}</p>
        </div>
        <div className="flex justify-center"><GameComponent /></div>
      </main>
    </div>
  );
}
