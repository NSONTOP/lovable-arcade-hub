import { Header } from '@/components/layout/Header';
import { Trophy, Medal, Crown, User } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'CyberNinja42', score: 15420, games: 89, avatar: 'CN' },
  { rank: 2, name: 'NeonMaster', score: 14350, games: 76, avatar: 'NM' },
  { rank: 3, name: 'PixelWarrior', score: 13890, games: 82, avatar: 'PW' },
  { rank: 4, name: 'GlitchHunter', score: 12750, games: 65, avatar: 'GH' },
  { rank: 5, name: 'ByteRunner', score: 11980, games: 71, avatar: 'BR' },
  { rank: 6, name: 'VoidWalker', score: 11450, games: 58, avatar: 'VW' },
  { rank: 7, name: 'DataDemon', score: 10890, games: 62, avatar: 'DD' },
  { rank: 8, name: 'CircuitBreaker', score: 10340, games: 55, avatar: 'CB' },
  { rank: 9, name: 'HexMaster', score: 9870, games: 49, avatar: 'HM' },
  { rank: 10, name: 'BinaryKnight', score: 9420, games: 52, avatar: 'BK' },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="pt-24 pb-12 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-foreground neon-text mb-4"><span className="text-primary">GLOBAL</span> LEADERBOARD</h1>
          <p className="text-muted-foreground">Top players from around the world</p>
        </div>

        <div className="flex justify-center items-end gap-4 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground mb-2"><span className="text-xl font-display text-muted-foreground">{mockLeaderboard[1].avatar}</span></div>
            <Medal className="w-8 h-8 text-muted-foreground mb-2" />
            <div className="glass-card px-6 py-8 rounded-t-xl border border-muted-foreground/30 text-center w-32">
              <p className="font-display text-lg text-muted-foreground">2nd</p>
              <p className="font-body text-sm text-foreground mt-1">{mockLeaderboard[1].name}</p>
              <p className="font-display text-xl text-muted-foreground mt-2">{mockLeaderboard[1].score.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-col items-center -mt-8">
            <Crown className="w-10 h-10 text-neon-yellow mb-2 animate-float" />
            <div className="w-24 h-24 rounded-full bg-neon-yellow/20 flex items-center justify-center border-2 border-neon-yellow mb-2 shadow-[0_0_30px_hsl(50,100%,55%,0.3)]"><span className="text-2xl font-display text-neon-yellow">{mockLeaderboard[0].avatar}</span></div>
            <div className="glass-card px-8 py-12 rounded-t-xl border border-neon-yellow/30 text-center w-36 shadow-[0_0_30px_hsl(50,100%,55%,0.2)]">
              <p className="font-display text-xl text-neon-yellow">1st</p>
              <p className="font-body text-sm text-foreground mt-1">{mockLeaderboard[0].name}</p>
              <p className="font-display text-2xl text-neon-yellow mt-2">{mockLeaderboard[0].score.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-neon-orange/50 mb-2"><span className="text-xl font-display text-neon-orange">{mockLeaderboard[2].avatar}</span></div>
            <Trophy className="w-8 h-8 text-neon-orange mb-2" />
            <div className="glass-card px-6 py-8 rounded-t-xl border border-neon-orange/30 text-center w-32">
              <p className="font-display text-lg text-neon-orange">3rd</p>
              <p className="font-body text-sm text-foreground mt-1">{mockLeaderboard[2].name}</p>
              <p className="font-display text-xl text-neon-orange mt-2">{mockLeaderboard[2].score.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-primary/20 overflow-hidden max-w-4xl mx-auto">
          <table className="w-full">
            <thead><tr className="border-b border-primary/20 bg-muted/50"><th className="px-6 py-4 text-left font-display text-sm text-muted-foreground">RANK</th><th className="px-6 py-4 text-left font-display text-sm text-muted-foreground">PLAYER</th><th className="px-6 py-4 text-right font-display text-sm text-muted-foreground">SCORE</th><th className="px-6 py-4 text-right font-display text-sm text-muted-foreground">GAMES</th></tr></thead>
            <tbody>
              {mockLeaderboard.map((player, index) => (
                <tr key={player.rank} className="border-b border-primary/10 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4"><span className={`font-display text-lg ${index === 0 ? 'text-neon-yellow' : index === 1 ? 'text-muted-foreground' : index === 2 ? 'text-neon-orange' : 'text-foreground'}`}>#{player.rank}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-primary/20"><User className="w-5 h-5 text-muted-foreground" /></div><span className="font-body text-foreground">{player.name}</span></div></td>
                  <td className="px-6 py-4 text-right"><span className="font-display text-primary">{player.score.toLocaleString()}</span></td>
                  <td className="px-6 py-4 text-right"><span className="font-body text-muted-foreground">{player.games}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
