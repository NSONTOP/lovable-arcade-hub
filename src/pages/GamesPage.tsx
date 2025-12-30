import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { GameCard } from '@/components/games/GameCard';
import { games, categories } from '@/data/games';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div><h1 className="text-4xl font-display font-bold text-foreground neon-text">ALL <span className="text-primary">GAMES</span></h1></div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search games..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-muted border-primary/30 focus:border-primary" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(category => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-lg font-display text-sm transition-all duration-200 ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}>{category}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (<GameCard key={game.id} {...game} />))}
        </div>
      </main>
    </div>
  );
}
