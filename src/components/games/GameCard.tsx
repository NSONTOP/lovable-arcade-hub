import { Link } from 'react-router-dom';
import { Play, Users, Star, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface GameCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  players: string;
  rating: number;
  playTime: string;
  color: 'cyan' | 'magenta' | 'purple' | 'green' | 'orange' | 'yellow';
  available?: boolean;
}

const colorMap = {
  cyan: 'border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_30px_hsl(180,100%,50%,0.3)]',
  magenta: 'border-neon-magenta/30 hover:border-neon-magenta hover:shadow-[0_0_30px_hsl(300,100%,60%,0.3)]',
  purple: 'border-neon-purple/30 hover:border-neon-purple hover:shadow-[0_0_30px_hsl(280,100%,65%,0.3)]',
  green: 'border-neon-green/30 hover:border-neon-green hover:shadow-[0_0_30px_hsl(150,100%,50%,0.3)]',
  orange: 'border-neon-orange/30 hover:border-neon-orange hover:shadow-[0_0_30px_hsl(30,100%,55%,0.3)]',
  yellow: 'border-neon-yellow/30 hover:border-neon-yellow hover:shadow-[0_0_30px_hsl(50,100%,55%,0.3)]',
};

const iconColorMap = {
  cyan: 'text-neon-cyan',
  magenta: 'text-neon-magenta',
  purple: 'text-neon-purple',
  green: 'text-neon-green',
  orange: 'text-neon-orange',
  yellow: 'text-neon-yellow',
};

export function GameCard({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  category, 
  players, 
  rating, 
  playTime, 
  color,
  available = true 
}: GameCardProps) {
  const cardClasses = `
    group block glass-card rounded-xl p-6 border-2 transition-all duration-300
    ${colorMap[color]}
    ${available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
  `;

  const content = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-muted ${iconColorMap[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
        <span className={`text-xs font-display uppercase tracking-wider px-2 py-1 rounded bg-muted ${iconColorMap[color]}`}>
          {category}
        </span>
      </div>

      <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/10 pt-4">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{players}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-neon-yellow" />
          <span>{rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{playTime}</span>
        </div>
      </div>

      {available && (
        <div className="mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary font-display text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4" />
          PLAY NOW
        </div>
      )}

      {!available && (
        <div className="mt-4 text-center py-2 rounded-lg bg-muted text-muted-foreground font-display text-sm">
          COMING SOON
        </div>
      )}
    </>
  );

  if (available) {
    return <Link to={`/game/${id}`} className={cardClasses}>{content}</Link>;
  }

  return <div className={cardClasses}>{content}</div>;

}
