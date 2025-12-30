import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  variant?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export function AdBanner({ variant = 'horizontal', className = '' }: AdBannerProps) {
  const sizeClasses = {
    horizontal: 'h-24 w-full',
    vertical: 'w-40 h-[600px]',
    square: 'w-[300px] h-[250px]',
  };

  return (
    <div 
      className={`
        glass-card border border-primary/10 flex items-center justify-center
        ${sizeClasses[variant]} ${className}
      `}
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <ExternalLink className="w-4 h-4" />
          <span className="text-xs font-body uppercase tracking-wider">Advertisement</span>
        </div>
        <p className="text-xs text-muted-foreground/60">Ad Space Available</p>
      </div>
    </div>
  );
}
