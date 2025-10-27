import type { PuzzlePiece, PuzzleConfig } from "../types";

export const generatePuzzlePieces = (config: PuzzleConfig): PuzzlePiece[] => {
  const pieces: PuzzlePiece[] = [];
  const { rows, cols, pieceSize } = config;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const id = `piece-${row}-${col}`;
      const correctX = col * pieceSize;
      const correctY = row * pieceSize;
      const imageX = col * pieceSize;
      const imageY = row * pieceSize;

      // Generate random position for initial placement (outside the board)
      const randomX = Math.random() * 200 + 400; // Place to the right of the board
      const randomY = Math.random() * 200 + 100; // Random vertical position

      pieces.push({
        id,
        x: randomX,
        y: randomY,
        correctX,
        correctY,
        imageX,
        imageY,
        width: pieceSize,
        height: pieceSize,
        isPlaced: false,
        isSelected: false,
      });
    }
  }

  // Shuffle the pieces
  return shuffleArray(pieces);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const checkPuzzleComplete = (pieces: PuzzlePiece[]): boolean => {
  return pieces.every((piece) => piece.isPlaced);
};

export const checkPuzzleCorrectness = (pieces: PuzzlePiece[]): boolean => {
  // Check if all pieces are placed
  if (!pieces.every((piece) => piece.isPlaced)) {
    return false;
  }

  // Check if each piece is in its correct position
  return pieces.every(
    (piece) => piece.x === piece.correctX && piece.y === piece.correctY
  );
};

export const getPuzzleDifficulty = (
  rows: number,
  cols: number
): "easy" | "medium" | "hard" => {
  const totalPieces = rows * cols;
  if (totalPieces <= 9) return "easy";
  if (totalPieces <= 25) return "medium";
  return "hard";
};

export const calculateSnapDistance = (
  piece: PuzzlePiece,
  targetX: number,
  targetY: number
): number => {
  const dx = piece.x - targetX;
  const dy = piece.y - targetY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const isWithinSnapThreshold = (
  piece: PuzzlePiece,
  targetX: number,
  targetY: number,
  threshold: number
): boolean => {
  return calculateSnapDistance(piece, targetX, targetY) < threshold;
};
