import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import "./Timer.css";

interface TimerProps {
  timeLimit: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeLimit,
  onTimeUp,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  useEffect(() => {
    if (isActive) {
      setTimeLeft(timeLimit);
    }
  }, [isActive, timeLimit]);

  const progress = (timeLeft / timeLimit) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div
      className={`timer ${isWarning ? "warning" : ""} ${
        isCritical ? "critical" : ""
      }`}
    >
      <div className="timer-icon">
        <Clock size={20} />
      </div>
      <div className="timer-content">
        <div className="timer-text">{timeLeft}s</div>
        <div className="timer-bar">
          <div className="timer-progress" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};
