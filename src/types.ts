export interface PuzzlePiece {
  id: string;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  imageX: number;
  imageY: number;
  width: number;
  height: number;
  isPlaced: boolean;
  isSelected: boolean;
}

export interface PuzzleConfig {
  rows: number;
  cols: number;
  pieceSize: number;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface GameState {
  pieces: PuzzlePiece[];
  isComplete: boolean;
  startTime: Date | null;
  endTime: Date | null;
  moves: number;
  selectedPiece: string | null;
}

export interface DragItem {
  type: "puzzle-piece";
  id: string;
}

export interface LevelResult {
  level: number;
  completed: boolean;
  timeUsed: number;
  score: number;
  imageUrl: string;
}

export interface GameLevel {
  id: number;
  imageUrl: string;
  name: string;
}

export interface GameSession {
  currentLevel: number;
  totalLevels: number;
  levelResults: LevelResult[];
  totalScore: number;
  totalTime: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  playerName: string;
}

export interface UserProfile {
  name: string;
  bestScore: number;
  bestTime: number;
  gamesPlayed: number;
  lastPlayed: string;
}
