import { Header } from '@/components/layout/Header';
import { AdBanner } from '@/components/layout/AdBanner';
import { GameCard } from '@/components/games/GameCard';
import { games } from '@/data/games';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, Users, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const featuredGames = games.filter(g => g.available).slice(0, 4);
  const comingSoonGames = games.filter(g => !g.available).slice(0, 4);

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-display mb-6 animate-pulse-glow">
              <Zap className="w-4 h-4" />
              100+ GAMES AVAILABLE
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6">
              THE ULTIMATE
              <span className="block text-primary neon-text">GAMING HUB</span>
            </h1>
            <p className="text-xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Experience the future of gaming. Play classic favorites, challenge friends, 
              and compete on global leaderboards. All in one sleek, futuristic platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/games">
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/80 text-primary-foreground font-display px-8">
                  <Gamepad2 className="w-5 h-5" />
                  PLAY NOW
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button size="lg" variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10 font-display px-8">
                  <Trophy className="w-5 h-5" />
                  LEADERBOARD
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { icon: Gamepad2, label: 'Games', value: '100+' },
              { icon: Users, label: 'Players', value: '50K+' },
              { icon: Trophy, label: 'Tournaments', value: '200+' },
              { icon: Zap, label: 'Played Daily', value: '10K+' },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4 rounded-xl border border-primary/20 text-center hover-glow">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="container mx-auto px-4">
        <AdBanner variant="horizontal" />
      </div>

      {/* Featured Games */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">
                <span className="text-primary">FEATURED</span> GAMES
              </h2>
              <p className="text-muted-foreground mt-1">Jump right in and start playing!</p>
            </div>
            <Link to="/games" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-display">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map(game => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">
                COMING <span className="text-secondary">SOON</span>
              </h2>
              <p className="text-muted-foreground mt-1">Exciting new games on the way!</p>
            </div>
            <Link to="/games" className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-display">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonGames.map(game => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="container mx-auto px-4 py-8">
        <AdBanner variant="horizontal" />
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-display text-lg text-foreground">
                NEXUS<span className="text-primary">ARCADE</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              © 2024 Nexus Arcade. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
