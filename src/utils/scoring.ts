import type { LevelResult } from "../types";

export const calculateScore = (timeUsed: number): number => {
  // Base score is 100, reduced by time used
  // If completed in 10 seconds or less, get bonus points
  const baseScore = 100;
  const timePenalty = Math.max(0, timeUsed - 5); // Start penalty after 5 seconds
  const timeBonus = timeUsed <= 10 ? 20 : 0; // Bonus for quick completion

  const score = Math.max(0, baseScore - timePenalty + timeBonus);
  return Math.round(score);
};

export const calculateTotalScore = (levelResults: LevelResult[]): number => {
  return levelResults.reduce((total, result) => total + result.score, 0);
};

export const calculateTotalTime = (levelResults: LevelResult[]): number => {
  return levelResults.reduce((total, result) => total + result.timeUsed, 0);
};

export const getScoreGrade = (score: number): string => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
};
