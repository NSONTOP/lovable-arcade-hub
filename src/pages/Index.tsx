import { Header } from '@/components/layout/Header';
import { GameCard } from '@/components/games/GameCard';
import { games } from '@/data/games';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, Users, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const featuredGames = games.slice(0, 8);

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-display mb-6 animate-pulse-glow">
              <Zap className="w-4 h-4" />
              {games.length} GAMES AVAILABLE
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6">
              THE ULTIMATE<span className="block text-primary neon-text">GAMING HUB</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Experience the future of gaming. Play classic favorites, challenge friends, and compete on global leaderboards.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/games"><Button size="lg" className="gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-display px-8"><Gamepad2 className="w-5 h-5" />PLAY NOW</Button></Link>
              <Link to="/leaderboard"><Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10 font-display px-8"><Trophy className="w-5 h-5" />LEADERBOARD</Button></Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[{ icon: Gamepad2, label: 'Games', value: `${games.length}+` }, { icon: Users, label: 'Players', value: '50K+' }, { icon: Trophy, label: 'Tournaments', value: '200+' }, { icon: Zap, label: 'Played Daily', value: '10K+' }].map((stat, index) => (
              <div key={index} className="glass-card p-4 rounded-xl border border-primary/20 text-center hover-glow">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div><h2 className="text-3xl font-display font-bold text-foreground"><span className="text-primary">ALL</span> GAMES</h2></div>
            <Link to="/games" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-display">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map(game => (<GameCard key={game.id} {...game} />))}
          </div>
        </div>
      </section>

      <footer className="border-t border-primary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3"><Gamepad2 className="w-6 h-6 text-primary" /><span className="font-display text-lg text-foreground">NEXUS<span className="text-primary">ARCADE</span></span></div>
            <p className="text-sm text-muted-foreground font-body">© 2024 Nexus Arcade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
