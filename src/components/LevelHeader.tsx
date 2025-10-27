import React from "react";
import { CheckCircle } from "lucide-react";
import "./LevelHeader.css";

interface LevelHeaderProps {
  currentLevel: number;
  totalLevels: number;
  isComplete: boolean;
  onSubmit: () => void;
  canSubmit: boolean;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  currentLevel,
  totalLevels,
  isComplete,
  onSubmit,
  canSubmit,
}) => {
  return (
    <div className="level-header">
      <div className="level-info">
        <div className="level-title">
          Level {currentLevel} of {totalLevels}
        </div>
        <div className="level-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentLevel / totalLevels) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="level-actions">
        {isComplete && canSubmit && (
          <button className="submit-btn" onClick={onSubmit}>
            <CheckCircle size={20} />
            Submit
          </button>
        )}
      </div>
    </div>
  );
};
