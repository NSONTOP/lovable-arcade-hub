import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AdBanner } from '@/components/layout/AdBanner';
import { TicTacToe } from '@/components/games/TicTacToe';
import { FlappyBird } from '@/components/games/FlappyBird';
import { MemoryMatch } from '@/components/games/MemoryMatch';
import { SnakeGame } from '@/components/games/SnakeGame';
import { games } from '@/data/games';

const gameComponents: Record<string, React.FC> = {
  'tic-tac-toe': TicTacToe,
  'flappy-bird': FlappyBird,
  'memory-match': MemoryMatch,
  'snake': SnakeGame,
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
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Game Not Found
            </h1>
            <p className="text-muted-foreground mb-8">This game doesn't exist or is coming soon!</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
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
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Link>
          <h1 className="text-4xl font-display font-bold text-foreground neon-text">
            {game.title}
          </h1>
          <p className="text-muted-foreground mt-2">{game.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex justify-center">
            <GameComponent />
          </div>
          
          <aside className="lg:w-[300px] space-y-6">
            <AdBanner variant="square" />
            <div className="glass-card p-4 rounded-xl border border-primary/20">
              <h3 className="font-display text-lg text-foreground mb-3">Game Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-primary">{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players</span>
                  <span className="text-foreground">{game.players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Play Time</span>
                  <span className="text-foreground">{game.playTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="text-neon-yellow">★ {game.rating}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <AdBanner variant="horizontal" />
        </div>
      </main>
    </div>
  );
}
