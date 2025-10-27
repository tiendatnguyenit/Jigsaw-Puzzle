import React from "react";
import { Trophy, Clock, Star, RotateCcw } from "lucide-react";
import type { LevelResult } from "../types";
import "./ResultScreen.css";

interface ResultScreenProps {
  levelResults: LevelResult[];
  totalScore: number;
  totalTime: number;
  playerName: string;
  onPlayAgain: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  levelResults,
  totalScore,
  totalTime,
  playerName,
  onPlayAgain,
}) => {
  const completedLevels = levelResults.filter(
    (result) => result.completed
  ).length;
  const totalLevels = levelResults.length;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "#4CAF50";
    if (score >= 70) return "#FF9800";
    return "#F44336";
  };


  return (
    <div className="result-screen">
      <div className="result-container">
        <div className="result-header">
          <Trophy className="result-icon" size={48} />
          <h1>Game Complete!</h1>
          <p className="player-name">Great job, {playerName}!</p>
          <p>
            You completed {completedLevels} out of {totalLevels} levels
          </p>
        </div>

        <div className="result-summary">
          <div className="summary-item">
            <Star className="summary-icon" size={24} />
            <div className="summary-content">
              <div className="summary-label">Total Score</div>
              <div
                className="summary-value"
                style={{ color: getScoreColor(totalScore) }}
              >
                {totalScore}
              </div>
            </div>
          </div>
          <div className="summary-item">
            <Clock className="summary-icon" size={24} />
            <div className="summary-content">
              <div className="summary-label">Total Time</div>
              <div className="summary-value">{formatTime(totalTime)}</div>
            </div>
          </div>
        </div>

        <div className="level-results">
          <h2>Level Results</h2>
          <div className="results-grid">
            {levelResults.map((result) => (
              <div key={result.level} className="level-result">
                <div className="level-header">
                  <div className="level-number">Level {result.level}</div>
                  <div
                    className={`level-status ${
                      result.completed ? "completed" : "failed"
                    }`}
                  >
                    {result.completed ? "✓" : "✗"}
                  </div>
                </div>
                <div className="level-image">
                  <img src={result.imageUrl} alt={`Level ${result.level}`} />
                </div>
                <div className="level-details">
                  <div className="level-time">
                    <Clock size={16} />
                    {formatTime(result.timeUsed)}
                  </div>
                  <div
                    className="level-score"
                    style={{ color: getScoreColor(result.score) }}
                  >
                    <Star size={16} />
                    {result.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="result-actions">
          <button className="play-again-btn" onClick={onPlayAgain}>
            <RotateCcw size={20} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
