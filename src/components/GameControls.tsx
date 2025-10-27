import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Settings, Play, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import type { PuzzleConfig, PuzzlePiece } from '../types';
import { PuzzlePieceComponent } from './PuzzlePiece';
import './GameControls.css';

interface GameControlsProps {
  puzzleConfig: PuzzleConfig;
  setPuzzleConfig: (config: PuzzleConfig) => void;
  onStartGame: () => void;
  onResetGame: () => void;
  isGameStarted: boolean;
  isGameComplete: boolean;
  pieces: PuzzlePiece[];
  onPiecesUpdate: (pieces: PuzzlePiece[]) => void;
  selectedPiece: string | null;
  onPieceSelect: (pieceId: string | null) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  puzzleConfig,
  setPuzzleConfig,
  onStartGame,
  onResetGame,
  isGameStarted,
  isGameComplete,
  pieces,
  onPiecesUpdate,
  selectedPiece,
  onPieceSelect,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Drop zone for pieces
  const [, drop] = useDrop({
    accept: 'puzzle-piece',
    drop: (item: { id: string }, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      // Move piece to holding area (set isPlaced to false and position in holding area)
      const updatedPieces = pieces.map(p => 
        p.id === item.id 
          ? { ...p, x: 50, y: 50, isPlaced: false }
          : p
      );
      onPiecesUpdate(updatedPieces);
    },
  });

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    const configs = {
      easy: { rows: 3, cols: 3, pieceSize: 100 },
      medium: { rows: 4, cols: 4, pieceSize: 80 },
      hard: { rows: 6, cols: 6, pieceSize: 60 },
    };

    setPuzzleConfig({
      ...puzzleConfig,
      ...configs[difficulty],
      difficulty,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPuzzleConfig({
          ...puzzleConfig,
          imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomImageSubmit = () => {
    if (customImageUrl.trim()) {
      setPuzzleConfig({
        ...puzzleConfig,
        imageUrl: customImageUrl.trim(),
      });
      setCustomImageUrl('');
    }
  };

  const presetImages = [
    { name: 'Nature', url: 'https://picsum.photos/400/400?random=1' },
    { name: 'City', url: 'https://picsum.photos/400/400?random=2' },
    { name: 'Ocean', url: 'https://picsum.photos/400/400?random=3' },
    { name: 'Mountains', url: 'https://picsum.photos/400/400?random=4' },
  ];

  return (
    <div className="game-controls">
      <div className="controls-header">
        <h2>Game Settings</h2>
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="controls-content">
          {/* Difficulty Selection */}
          <div className="control-group">
            <label>Difficulty:</label>
            <div className="difficulty-buttons">
              {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  className={`difficulty-btn ${puzzleConfig.difficulty === difficulty ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange(difficulty)}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Image Selection */}
          <div className="control-group">
            <label>Choose Image:</label>
            <div className="image-options">
              <div className="preset-images">
                {presetImages.map((image, index) => (
                  <button
                    key={index}
                    className={`preset-image ${puzzleConfig.imageUrl === image.url ? 'active' : ''}`}
                    onClick={() => setPuzzleConfig({ ...puzzleConfig, imageUrl: image.url })}
                  >
                    <img src={image.url} alt={image.name} />
                    <span>{image.name}</span>
                  </button>
                ))}
              </div>

              <div className="custom-image">
                <div className="file-upload">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    <Upload size={16} />
                    Upload Image
                  </label>
                </div>

                <div className="url-input">
                  <input
                    type="url"
                    placeholder="Or enter image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                  />
                  <button onClick={handleCustomImageSubmit}>
                    <ImageIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Actions */}
      <div className="game-actions">
        {!isGameStarted ? (
          <button className="start-btn" onClick={onStartGame}>
            <Play size={20} />
            Start Game
          </button>
        ) : (
          <button className="reset-btn" onClick={onResetGame}>
            <RotateCcw size={20} />
            {isGameComplete ? 'New Game' : 'Reset'}
          </button>
        )}
      </div>

      {/* Pieces Holding Area */}
      {isGameStarted && (
        <div 
          ref={drop as any}
          className="pieces-holding-area"
        >
          <h3>Hold Pieces Here</h3>
          <div className="holding-pieces">
            {pieces
              .filter(piece => !piece.isPlaced)
              .map(piece => (
                <PuzzlePieceComponent
                  key={piece.id}
                  piece={piece}
                  puzzleConfig={puzzleConfig}
                  onClick={() => onPieceSelect(selectedPiece === piece.id ? null : piece.id)}
                  isSelected={selectedPiece === piece.id}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
