import React from 'react';
import { Clock, Move, CheckCircle, Trophy } from 'lucide-react';
import type { GameState } from '../types';
import './GameStats.css';

interface GameStatsProps {
  gameState: GameState;
  isGameStarted: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState, isGameStarted }) => {

  const getElapsedTime = () => {
    if (!gameState.startTime) return '00:00';
    const endTime = gameState.endTime || new Date();
    const elapsed = Math.floor((endTime.getTime() - gameState.startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPlacedPieces = () => {
    return gameState.pieces.filter(piece => piece.isPlaced).length;
  };

  const getTotalPieces = () => {
    return gameState.pieces.length;
  };

  const getCompletionPercentage = () => {
    if (getTotalPieces() === 0) return 0;
    return Math.round((getPlacedPieces() / getTotalPieces()) * 100);
  };

  return (
    <div className="game-stats">
      <div className="stats-header">
        <h3>Game Statistics</h3>
        {gameState.isComplete && (
          <div className="completion-badge">
            <Trophy size={20} />
            <span>Completed!</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon">
            <Clock size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Time</div>
            <div className="stat-value">
              {isGameStarted ? getElapsedTime() : '00:00'}
            </div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Move size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Moves</div>
            <div className="stat-value">{gameState.moves}</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <CheckCircle size={18} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Progress</div>
            <div className="stat-value">
              {getPlacedPieces()}/{getTotalPieces()}
            </div>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${getCompletionPercentage()}%` }}
        />
      </div>

      <div className="progress-text">
        {getCompletionPercentage()}% Complete
      </div>

      {gameState.isComplete && gameState.startTime && gameState.endTime && (
        <div className="completion-stats">
          <h4>Congratulations! 🎉</h4>
          <p>You completed the puzzle in {getElapsedTime()} with {gameState.moves} moves!</p>
        </div>
      )}
    </div>
  );
};
