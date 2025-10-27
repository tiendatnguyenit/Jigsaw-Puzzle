import type { UserProfile, LevelResult } from "../types";

const USER_PROFILE_KEY = "jigsaw-puzzle-user-profile";

export const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
  return null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

export const updateUserProfile = (
  playerName: string,
  levelResults: LevelResult[]
): UserProfile => {
  const existingProfile = getUserProfile();
  const totalScore = levelResults.reduce(
    (sum, result) => sum + result.score,
    0
  );
  // Calculate actual time used (sum of individual level times)
  const actualTimeUsed = levelResults.reduce(
    (sum, result) => sum + result.timeUsed,
    0
  );
  // For best time comparison, use actual time used
  const totalTime = actualTimeUsed;

  const newProfile: UserProfile = {
    name: playerName,
    bestScore: existingProfile
      ? Math.max(existingProfile.bestScore, totalScore)
      : totalScore,
    bestTime: existingProfile
      ? Math.min(existingProfile.bestTime, totalTime)
      : totalTime,
    gamesPlayed: existingProfile ? existingProfile.gamesPlayed + 1 : 1,
    lastPlayed: new Date().toISOString(),
  };

  saveUserProfile(newProfile);
  return newProfile;
};

export const clearUserProfile = (): void => {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing user profile:", error);
  }
};
