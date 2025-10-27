import React, { useState, useEffect } from "react";
import { User, Play, Trophy } from "lucide-react";
import type { UserProfile } from "../types";
import { getUserProfile } from "../utils/userProfile";
import "./UserNameInput.css";

interface UserNameInputProps {
  onStartGame: (playerName: string) => void;
}

export const UserNameInput: React.FC<UserNameInputProps> = ({
  onStartGame,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setUserProfile(profile);
    if (profile) {
      setPlayerName(profile.name);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="user-name-container">
      <div className="user-name-card">
        <div className="user-header">
          <User className="user-icon" size={32} />
          <h2>Enter Your Name</h2>
          <p>Start your jigsaw puzzle challenge!</p>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="input-group">
            <label htmlFor="playerName">Player Name</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="start-game-btn"
              disabled={!playerName.trim()}
            >
              <Play size={20} />
              Start Game
            </button>
          </div>
        </form>

        {userProfile && (
          <div className="user-stats">
            <button
              className="stats-toggle"
              onClick={() => setShowProfile(!showProfile)}
            >
              <Trophy size={16} />
              Your Stats
            </button>

            {showProfile && (
              <div className="stats-content">
                <div className="stat-item">
                  <span className="stat-label">Games Played:</span>
                  <span className="stat-value">{userProfile.gamesPlayed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Best Score:</span>
                  <span className="stat-value">{userProfile.bestScore}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Best Time:</span>
                  <span className="stat-value">
                    {formatTime(userProfile.bestTime)}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Played:</span>
                  <span className="stat-value">
                    {formatDate(userProfile.lastPlayed)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
