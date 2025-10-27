import React from "react";
import type { PuzzlePiece, PuzzleConfig } from "../types";
import "./MobilePieceSelector.css";

interface MobilePieceSelectorProps {
  pieces: PuzzlePiece[];
  puzzleConfig: PuzzleConfig;
  selectedPiece: string | null;
  onPieceSelect: (pieceId: string | null) => void;
  onPlacePiece: (pieceId: string, slotX: number, slotY: number) => void;
  onRemovePiece: (pieceId: string) => void;
}

export const MobilePieceSelector: React.FC<MobilePieceSelectorProps> = ({
  pieces,
  puzzleConfig,
  selectedPiece,
  onPieceSelect,
  onPlacePiece,
  onRemovePiece,
}) => {
  const unplacedPieces = pieces.filter((piece) => !piece.isPlaced);
  const placedPieces = pieces.filter((piece) => piece.isPlaced);

  const handlePieceTap = (pieceId: string) => {
    if (selectedPiece === pieceId) {
      onPieceSelect(null); // Deselect if already selected
    } else {
      onPieceSelect(pieceId); // Select the piece
    }
  };

  const handleSlotTap = (slotX: number, slotY: number) => {
    if (selectedPiece) {
      // Check if slot is already occupied
      const isOccupied = placedPieces.some(
        (piece) => piece.x === slotX && piece.y === slotY
      );

      if (!isOccupied) {
        onPlacePiece(selectedPiece, slotX, slotY);
        onPieceSelect(null); // Deselect after placing
      }
    } else {
      // If no piece selected, allow removing piece from slot
      const pieceInSlot = placedPieces.find(
        (piece) => piece.x === slotX && piece.y === slotY
      );

      if (pieceInSlot) {
        onRemovePiece(pieceInSlot.id);
      }
    }
  };

  const renderSlot = (row: number, col: number) => {
    const slotX = col * puzzleConfig.pieceSize;
    const slotY = row * puzzleConfig.pieceSize;

    const pieceInSlot = placedPieces.find(
      (piece) => piece.x === slotX && piece.y === slotY
    );

    return (
      <div
        key={`slot-${row}-${col}`}
        className={`puzzle-slot ${selectedPiece ? "slot-selectable" : ""} ${
          pieceInSlot && !selectedPiece ? "slot-removable" : ""
        }`}
        onClick={() => handleSlotTap(slotX, slotY)}
      >
        {pieceInSlot && (
          <div
            className="slot-piece"
            style={{
              backgroundImage: `url(${puzzleConfig.imageUrl})`,
              backgroundPosition: `-${pieceInSlot.imageX}px -${pieceInSlot.imageY}px`,
              backgroundSize: `${
                puzzleConfig.pieceSize * puzzleConfig.cols
              }px ${puzzleConfig.pieceSize * puzzleConfig.rows}px`,
            }}
          />
        )}
        {!pieceInSlot && selectedPiece && (
          <div className="slot-placeholder">
            <span>Tap to place</span>
          </div>
        )}
        {pieceInSlot && !selectedPiece && (
          <div className="slot-remove-hint">
            <span>Tap to remove</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mobile-piece-selector">
      {/* Puzzle Board with Slots */}
      <div className="mobile-puzzle-board">
        <div className="puzzle-slots">
          {Array.from({ length: puzzleConfig.rows }, (_, row) => (
            <div key={`row-${row}`} className="puzzle-row">
              {Array.from({ length: puzzleConfig.cols }, (_, col) =>
                renderSlot(row, col)
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Piece Selection Area */}
      <div className="mobile-piece-selection">
        <h3>Select a piece to place:</h3>
        <div className="piece-grid">
          {unplacedPieces.map((piece) => (
            <div
              key={piece.id}
              className={`mobile-piece ${
                selectedPiece === piece.id ? "selected" : ""
              }`}
              onClick={() => handlePieceTap(piece.id)}
              style={{
                width: puzzleConfig.pieceSize * 0.6,
                height: puzzleConfig.pieceSize * 0.6,
                backgroundImage: `url(${puzzleConfig.imageUrl})`,
                backgroundPosition: `-${piece.imageX}px -${piece.imageY}px`,
                backgroundSize: `${
                  puzzleConfig.pieceSize * puzzleConfig.cols
                }px ${puzzleConfig.pieceSize * puzzleConfig.rows}px`,
              }}
            >
              {selectedPiece === piece.id && (
                <div className="selection-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedPiece && (
          <div className="selection-instructions">
            <p>Now tap on an empty slot to place the piece</p>
          </div>
        )}

        {!selectedPiece && placedPieces.length > 0 && (
          <div className="removal-instructions">
            <p>Tap on any placed piece to remove it and try again</p>
          </div>
        )}
      </div>
    </div>
  );
};
