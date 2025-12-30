import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Sparkles, Star, Heart, Moon, Sun, Zap, Diamond, Crown } from 'lucide-react';
import { toast } from 'sonner';

const ICONS = [Sparkles, Star, Heart, Moon, Sun, Zap, Diamond, Crown];

interface Card {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MemoryMatch() {
  const { isAdmin } = useAdmin();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const initializeGame = () => {
    const cardPairs: Card[] = [];
    for (let i = 0; i < ICONS.length; i++) {
      cardPairs.push({ id: i * 2, iconIndex: i, isFlipped: false, isMatched: false });
      cardPairs.push({ id: i * 2 + 1, iconIndex: i, isFlipped: false, isMatched: false });
    }
    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      // Admin cheat: always match
      const isMatch = isAdmin ? true : firstCard?.iconIndex === secondCard?.iconIndex;

      if (isMatch) {
        // Force match even if icons don't match in admin mode
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second || (isAdmin && c.iconIndex === firstCard?.iconIndex)
              ? { ...c, isMatched: true, isFlipped: true, iconIndex: firstCard?.iconIndex || c.iconIndex }
              : c
          ));
          setFlippedCards([]);
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === ICONS.length) {
              setIsWon(true);
              toast.success('🎉 You won!');
            }
            return newMatches;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, isAdmin]);

  useEffect(() => {
    if (isWon && (bestScore === null || moves < bestScore)) {
      setBestScore(moves);
    }
  }, [isWon, moves, bestScore]);

  const iconColors = [
    'text-neon-cyan',
    'text-neon-yellow',
    'text-neon-magenta',
    'text-neon-purple',
    'text-neon-orange',
    'text-neon-green',
    'text-primary',
    'text-secondary',
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      {isAdmin && (
        <div className="px-4 py-2 rounded-lg bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse">
          ⚡ ADMIN MODE: All cards match!
        </div>
      )}

      <div className="flex items-center gap-8 text-center">
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-purple/30">
          <p className="text-xs text-muted-foreground font-display">MOVES</p>
          <p className="text-2xl font-bold text-neon-purple">{moves}</p>
        </div>
        <div className="glass-card px-6 py-3 rounded-lg border border-neon-cyan/30">
          <p className="text-xs text-muted-foreground font-display">MATCHES</p>
          <p className="text-2xl font-bold text-neon-cyan">{matches}/{ICONS.length}</p>
        </div>
        {bestScore !== null && (
          <div className="glass-card px-6 py-3 rounded-lg border border-neon-yellow/30">
            <p className="text-xs text-muted-foreground font-display">BEST</p>
            <p className="text-2xl font-bold text-neon-yellow">{bestScore}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 p-4 glass-card rounded-xl border border-primary/30">
        {cards.map((card) => {
          const Icon = ICONS[card.iconIndex];
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-lg transition-all duration-300 border-2
                ${card.isFlipped || card.isMatched
                  ? 'bg-muted border-primary/50 rotate-0'
                  : 'bg-muted/50 border-primary/20 hover:border-primary/40'
                }
                ${card.isMatched ? 'opacity-70 scale-95' : ''}
                disabled:cursor-default
              `}
              style={{
                transformStyle: 'preserve-3d',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {(card.isFlipped || card.isMatched) && (
                <div style={{ transform: 'rotateY(180deg)' }}>
                  <Icon className={`w-8 h-8 mx-auto ${iconColors[card.iconIndex]}`} />
                </div>
              )}
              {!card.isFlipped && !card.isMatched && (
                <div className="w-8 h-8 mx-auto rounded bg-primary/10" />
              )}
            </button>
          );
        })}
      </div>

      {isWon && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-display">
            <Trophy className="w-6 h-6 text-neon-yellow" />
            <span className="text-neon-cyan">Completed in {moves} moves!</span>
          </div>
          <Button onClick={initializeGame} className="gap-2 bg-primary hover:bg-primary/80">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </div>
      )}

      {!isWon && (
        <Button onClick={initializeGame} variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
