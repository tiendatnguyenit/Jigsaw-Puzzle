import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import type { PuzzlePiece as PuzzlePieceType } from "../types";
import "./PuzzlePiece.css";

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  puzzleConfig: {
    rows: number;
    cols: number;
    pieceSize: number;
    imageUrl: string;
  };
  onClick: () => void;
  isSelected: boolean;
}

export const PuzzlePieceComponent: React.FC<PuzzlePieceProps> = ({
  piece,
  puzzleConfig,
  onClick,
  isSelected,
}) => {
  const pieceRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "puzzle-piece",
    item: { id: piece.id },
    canDrag: true, // Allow dragging even if piece is placed
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  // Use square shape instead of jigsaw shape
  const squareSize = puzzleConfig.pieceSize;

  const pieceStyle: React.CSSProperties = {
    position: piece.isPlaced ? "absolute" : "relative",
    left: piece.isPlaced ? piece.x : 0,
    top: piece.isPlaced ? piece.y : 0,
    width: squareSize,
    height: squareSize,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.7 : 1,
    zIndex: isSelected ? 10 : piece.isPlaced ? 5 : 1,
    transition: "all 0.2s ease",
  };

  return (
    <div
      ref={(node) => {
        pieceRef.current = node;
        drag(node);
      }}
      className={`puzzle-piece ${isSelected ? "selected" : ""} ${
        piece.isPlaced ? "placed" : "unplaced"
      }`}
      style={pieceStyle}
      onClick={handleClick}
      onMouseDown={handleClick}
    >
      <div
        className="piece-image"
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${puzzleConfig.imageUrl})`,
          backgroundPosition: `-${piece.imageX}px -${piece.imageY}px`,
          backgroundSize: `${puzzleConfig.pieceSize * puzzleConfig.cols}px ${
            puzzleConfig.pieceSize * puzzleConfig.rows
          }px`,
          border: piece.isPlaced ? "2px solid #666" : "2px solid #444",
          borderRadius: "4px",
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
        }}
      />
    </div>
  );
};
