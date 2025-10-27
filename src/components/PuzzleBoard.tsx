import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import type { PuzzlePiece } from "../types";
import { PuzzlePieceComponent } from "./PuzzlePiece";
import "./PuzzleBoard.css";

interface PuzzleBoardProps {
  pieces: PuzzlePiece[];
  puzzleConfig: {
    rows: number;
    cols: number;
    pieceSize: number;
    imageUrl: string;
  };
  onPiecesUpdate: (pieces: PuzzlePiece[]) => void;
  selectedPiece: string | null;
  onPieceSelect: (pieceId: string | null) => void;
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  pieces,
  puzzleConfig,
  onPiecesUpdate,
  selectedPiece,
  onPieceSelect,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "puzzle-piece",
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      // Get the drop position relative to the board
      const dropPosition = monitor.getClientOffset();
      if (!dropPosition) return;

      const newX = dropPosition.x - boardRect.left;
      const newY = dropPosition.y - boardRect.top;

      // Find the piece being dropped
      const piece = pieces.find((p) => p.id === item.id);
      if (!piece) return;

      // Calculate which grid slot the piece was dropped in
      const gridCol = Math.floor(newX / puzzleConfig.pieceSize);
      const gridRow = Math.floor(newY / puzzleConfig.pieceSize);

      // Check if the drop is within the grid bounds
      if (
        gridCol >= 0 &&
        gridCol < puzzleConfig.cols &&
        gridRow >= 0 &&
        gridRow < puzzleConfig.rows
      ) {
        // Calculate the exact position for this grid slot
        const slotX = gridCol * puzzleConfig.pieceSize;
        const slotY = gridRow * puzzleConfig.pieceSize;

        // Check if this slot is already occupied by another piece
        const isSlotOccupied = pieces.some(
          (p) =>
            p.id !== item.id && p.isPlaced && p.x === slotX && p.y === slotY
        );

        if (!isSlotOccupied) {
          // Place the piece in this slot
          const updatedPieces = pieces.map((p) =>
            p.id === item.id ? { ...p, x: slotX, y: slotY, isPlaced: true } : p
          );
          onPiecesUpdate(updatedPieces);
        } else {
          // Slot is occupied by another piece, don't move this piece
          return;
        }
      } else {
        // Drop is outside the grid, move piece back to holding area
        const updatedPieces = pieces.map((p) =>
          p.id === item.id
            ? {
                ...p,
                x: 50,
                y: 50,
                isPlaced: false,
              }
            : p
        );
        onPiecesUpdate(updatedPieces);
      }
    },
  });

  const handlePieceClick = useCallback(
    (pieceId: string) => {
      onPieceSelect(selectedPiece === pieceId ? null : pieceId);
    },
    [selectedPiece, onPieceSelect]
  );

  const boardWidth = puzzleConfig.cols * puzzleConfig.pieceSize;
  const boardHeight = puzzleConfig.rows * puzzleConfig.pieceSize;

  return (
    <div className="puzzle-board-container">
      <div
        ref={(node) => {
          boardRef.current = node;
          drop(node);
        }}
        className="puzzle-board"
        style={{
          width: boardWidth,
          height: boardHeight,
          backgroundColor: "white",
          border: "3px solid #333",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          overflow: "visible",
        }}
      >
        {/* Grid lines to show puzzle piece boundaries */}
        <div className="puzzle-grid">
          {Array.from({ length: puzzleConfig.rows - 1 }).map((_, rowIndex) => (
            <div
              key={`h-${rowIndex}`}
              className="grid-line horizontal"
              style={{
                position: "absolute",
                top: `${(rowIndex + 1) * puzzleConfig.pieceSize}px`,
                left: 0,
                right: 0,
                height: "2px",
                backgroundColor: "#e0e0e0",
                zIndex: 1,
              }}
            />
          ))}
          {Array.from({ length: puzzleConfig.cols - 1 }).map((_, colIndex) => (
            <div
              key={`v-${colIndex}`}
              className="grid-line vertical"
              style={{
                position: "absolute",
                left: `${(colIndex + 1) * puzzleConfig.pieceSize}px`,
                top: 0,
                bottom: 0,
                width: "2px",
                backgroundColor: "#e0e0e0",
                zIndex: 1,
              }}
            />
          ))}
        </div>
        {/* Render placed pieces */}
        {pieces
          .filter((piece) => piece.isPlaced)
          .map((piece) => (
            <PuzzlePieceComponent
              key={piece.id}
              piece={piece}
              puzzleConfig={puzzleConfig}
              onClick={() => handlePieceClick(piece.id)}
              isSelected={selectedPiece === piece.id}
            />
          ))}
      </div>
    </div>
  );
};
