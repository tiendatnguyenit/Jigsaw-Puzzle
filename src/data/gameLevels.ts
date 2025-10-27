import type { GameLevel } from "../types";

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    imageUrl: "/images/level1.jpg",
    name: "Level 1 - Your Image 1",
  },
  {
    id: 2,
    imageUrl: "/images/level2.jpg",
    name: "Level 2 - Your Image 2",
  },
  {
    id: 3,
    imageUrl: "/images/level3.jpg",
    name: "Level 3 - Your Image 3",
  },
  {
    id: 4,
    imageUrl: "/images/level4.jpg",
    name: "Level 4 - Your Image 4",
  },
  {
    id: 5,
    imageUrl: "/images/level5.jpg",
    name: "Level 5 - Your Image 5",
  },
];

export const LEVEL_TIME_LIMIT = 30; // seconds
export const PUZZLE_GRID_SIZE = 3; // 3x3 grid
export const PIECE_SIZE = 100; // pixels
