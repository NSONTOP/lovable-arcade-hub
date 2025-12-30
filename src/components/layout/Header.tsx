import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Shield, Menu, X } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Header() {
  const { isAdmin, checkAdminCode, setIsAdmin } = useAdmin();
  const [adminCode, setAdminCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminCode(adminCode)) {
      toast.success('🎮 ADMIN MODE ACTIVATED - You will always win!');
      setIsOpen(false);
      setAdminCode('');
    } else {
      toast.error('Invalid admin code');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast.info('Admin mode deactivated');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Gamepad2 className="w-8 h-8 text-primary neon-text group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-foreground neon-text">
              NEXUS<span className="text-primary">ARCADE</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="font-body text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/games" className="font-body text-muted-foreground hover:text-primary transition-colors">
              All Games
            </Link>
            <Link to="/leaderboard" className="font-body text-muted-foreground hover:text-primary transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-neon-orange/20 border border-neon-orange text-neon-orange text-sm font-display animate-pulse-glow">
                  ADMIN MODE
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Exit
                </Button>
              </div>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Shield className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-primary/30">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl text-center">
                      <span className="text-primary neon-text">ADMIN</span> ACCESS
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdminSubmit} className="space-y-4 mt-4">
                    <Input
                      type="password"
                      placeholder="Enter admin code..."
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="bg-muted border-primary/30 focus:border-primary"
                    />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-display">
                      AUTHENTICATE
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            <button
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary/20">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="font-body text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/games" 
                className="font-body text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Games
              </Link>
              <Link 
                to="/leaderboard" 
                className="font-body text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
