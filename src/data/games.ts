import { Grid3X3, Bird, Brain, Zap, Circle, Target, Sparkles, Timer, Dices, Puzzle, Bomb, Palette, Calculator, Music } from 'lucide-react';
import { GameCardProps } from '@/components/games/GameCard';

type GameData = Omit<GameCardProps, 'icon'> & { icon: any };

export const games: GameData[] = [
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic X and O strategy game. Be the first to get three in a row!', icon: Grid3X3, category: 'Strategy', players: '2P', rating: 4.5, playTime: '2 min', color: 'cyan', available: true },
  { id: 'flappy-bird', title: 'Flappy Bird', description: 'Navigate through pipes in this addictive endless runner!', icon: Bird, category: 'Arcade', players: '1P', rating: 4.8, playTime: 'Endless', color: 'green', available: true },
  { id: 'memory-match', title: 'Memory Match', description: 'Test your memory by matching pairs of cards!', icon: Brain, category: 'Puzzle', players: '1P', rating: 4.3, playTime: '5 min', color: 'purple', available: true },
  { id: 'snake', title: 'Snake', description: 'Grow your snake by eating food. Avoid hitting walls!', icon: Zap, category: 'Arcade', players: '1P', rating: 4.6, playTime: 'Endless', color: 'magenta', available: true },
  { id: 'air-hockey', title: 'Pong', description: 'Classic paddle game! First to 5 wins!', icon: Circle, category: 'Sports', players: '1P', rating: 4.4, playTime: '5 min', color: 'cyan', available: true },
  { id: 'target-shooter', title: 'Whack-a-Mole', description: 'Test your reflexes by whacking moles!', icon: Target, category: 'Action', players: '1P', rating: 4.2, playTime: '30 sec', color: 'orange', available: true },
  { id: 'magic-sparkles', title: 'Simon Says', description: 'Remember and repeat the color pattern!', icon: Sparkles, category: 'Puzzle', players: '1P', rating: 4.1, playTime: '5 min', color: 'magenta', available: true },
  { id: 'speed-run', title: 'Reaction Time', description: 'Test how fast you can react!', icon: Timer, category: 'Action', players: '1P', rating: 4.4, playTime: '1 min', color: 'green', available: true },
  { id: 'dice-roll', title: 'Rock Paper Scissors', description: 'Classic hand game against AI!', icon: Dices, category: 'Casual', players: '1P', rating: 4.0, playTime: '2 min', color: 'yellow', available: true },
  { id: 'puzzle-blocks', title: '2048', description: 'Slide tiles to reach 2048!', icon: Puzzle, category: 'Puzzle', players: '1P', rating: 4.7, playTime: 'Endless', color: 'purple', available: true },
  { id: 'bomb-defuser', title: 'Breakout', description: 'Break all the bricks with your ball!', icon: Bomb, category: 'Arcade', players: '1P', rating: 4.5, playTime: '5 min', color: 'orange', available: true },
  { id: 'color-match', title: 'Color Match', description: 'Match the word with its color!', icon: Palette, category: 'Puzzle', players: '1P', rating: 4.2, playTime: '30 sec', color: 'purple', available: true },
  { id: 'math-quiz', title: 'Number Guess', description: 'Guess the number between 1-100!', icon: Calculator, category: 'Puzzle', players: '1P', rating: 4.0, playTime: '3 min', color: 'green', available: true },
  { id: 'rhythm-game', title: 'Typing Speed', description: 'Test your typing speed!', icon: Music, category: 'Action', players: '1P', rating: 4.5, playTime: '30 sec', color: 'cyan', available: true },
];

export const categories = ['All', 'Strategy', 'Arcade', 'Puzzle', 'Action', 'Sports', 'Casual'];
