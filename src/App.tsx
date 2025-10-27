import { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PuzzleBoard } from "./components/PuzzleBoard";
import { GameControls } from "./components/GameControls";
import { GameStats } from "./components/GameStats";
import { Timer } from "./components/Timer";
import { LevelHeader } from "./components/LevelHeader";
import { ResultScreen } from "./components/ResultScreen";
import { UserNameInput } from "./components/UserNameInput";
import type {
  GameSession,
  LevelResult,
  PuzzleConfig,
  GameState,
} from "./types";
import {
  GAME_LEVELS,
  LEVEL_TIME_LIMIT,
  PUZZLE_GRID_SIZE,
  PIECE_SIZE,
} from "./data/gameLevels";
import {
  generatePuzzlePieces,
  checkPuzzleCorrectness,
} from "./utils/puzzleUtils";
import {
  calculateScore,
  calculateTotalScore,
  calculateTotalTime,
} from "./utils/scoring";
import { updateUserProfile } from "./utils/userProfile";
import "./App.css";

function App() {
  const [gameSession, setGameSession] = useState<GameSession>({
    currentLevel: 1,
    totalLevels: GAME_LEVELS.length,
    levelResults: [],
    totalScore: 0,
    totalTime: 0,
    gameStarted: false,
    gameCompleted: false,
    playerName: "",
  });

  const [gameState, setGameState] = useState<GameState>({
    pieces: [],
    isComplete: false,
    startTime: null,
    endTime: null,
    moves: 0,
    selectedPiece: null,
  });

  const [currentLevelStartTime, setCurrentLevelStartTime] =
    useState<Date | null>(null);
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const isProcessingLevelCompletion = useRef(false);

  const currentLevelData = GAME_LEVELS[gameSession.currentLevel - 1];
  const puzzleConfig: PuzzleConfig = {
    rows: PUZZLE_GRID_SIZE,
    cols: PUZZLE_GRID_SIZE,
    pieceSize: PIECE_SIZE,
    imageUrl: currentLevelData.imageUrl,
    difficulty: "easy",
  };

  // Initialize puzzle pieces when level changes
  useEffect(() => {
    if (gameSession.gameStarted && currentLevelData) {
      const pieces = generatePuzzlePieces(puzzleConfig);
      setGameState({
        pieces,
        isComplete: false,
        startTime: new Date(),
        endTime: null,
        moves: 0,
        selectedPiece: null,
      });
      setCurrentLevelStartTime(new Date());
    }
  }, [gameSession.currentLevel, gameSession.gameStarted]);

  // Note: Puzzle completion is now only checked when Submit button is pressed
  // No automatic completion detection

  const startGame = (playerName: string) => {
    setGameSession((prev) => ({
      ...prev,
      gameStarted: true,
      currentLevel: 1,
      levelResults: [],
      totalScore: 0,
      totalTime: 0,
      gameCompleted: false,
      playerName,
    }));
    setShowResultScreen(false);
  };

  const resetGame = () => {
    setGameSession({
      currentLevel: 1,
      totalLevels: GAME_LEVELS.length,
      levelResults: [],
      totalScore: 0,
      totalTime: 0,
      gameStarted: false,
      gameCompleted: false,
      playerName: "",
    });
    setGameState({
      pieces: [],
      isComplete: false,
      startTime: null,
      endTime: null,
      moves: 0,
      selectedPiece: null,
    });
    setShowResultScreen(false);
  };

  const updatePieces = (newPieces: typeof gameState.pieces) => {
    setGameState((prev) => ({
      ...prev,
      pieces: newPieces,
      moves: prev.moves + 1,
    }));
  };

  const handleTimeUp = () => {
    // Prevent multiple timeouts by checking if already completed or processing
    if (gameState.isComplete || isProcessingLevelCompletion.current) {
      return;
    }

    console.log(`Time up for level ${gameSession.currentLevel}`);
    isProcessingLevelCompletion.current = true;

    // Stop the timer by marking the level as complete
    setGameState((prev) => ({
      ...prev,
      isComplete: true,
      endTime: new Date(),
    }));
    completeLevel(false);
  };

  const handleSubmit = () => {
    // Prevent multiple submissions
    if (gameState.isComplete || isProcessingLevelCompletion.current) {
      return;
    }

    // Check if all pieces are placed
    const allPiecesPlaced = gameState.pieces.every((piece) => piece.isPlaced);

    if (!allPiecesPlaced) {
      // Not all pieces are placed yet
      setSubmitMessage("Please place all pieces before submitting!");
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }

    isProcessingLevelCompletion.current = true;

    // Check if pieces are in correct positions
    const isCorrectlyCompleted = checkPuzzleCorrectness(gameState.pieces);

    if (isCorrectlyCompleted) {
      // Puzzle is correctly completed
      setSubmitMessage("Correct! Well done!");
      setGameState((prev) => ({
        ...prev,
        isComplete: true,
        endTime: new Date(),
      }));
      setTimeout(() => {
        completeLevel(true);
        setSubmitMessage(null);
      }, 1500);
    } else {
      // Puzzle is not correctly completed
      setSubmitMessage("Incorrect! Try again or submit anyway.");
      setTimeout(() => {
        completeLevel(false);
        setSubmitMessage(null);
      }, 2000);
    }
  };

  const completeLevel = (completed: boolean) => {
    console.log(
      `Completing level ${gameSession.currentLevel}, completed: ${completed}`
    );

    const timeUsed = currentLevelStartTime
      ? Math.floor(
          (new Date().getTime() - currentLevelStartTime.getTime()) / 1000
        )
      : LEVEL_TIME_LIMIT;

    const score = completed ? calculateScore(timeUsed) : 0;

    const levelResult: LevelResult = {
      level: gameSession.currentLevel,
      completed,
      timeUsed,
      score,
      imageUrl: currentLevelData.imageUrl,
    };

    const newLevelResults = [...gameSession.levelResults, levelResult];
    const totalScore = calculateTotalScore(newLevelResults);
    const totalTime = calculateTotalTime(newLevelResults);

    if (gameSession.currentLevel < gameSession.totalLevels) {
      // Move to next level
      console.log(
        `Moving from level ${gameSession.currentLevel} to level ${
          gameSession.currentLevel + 1
        }`
      );
      setGameSession((prev) => ({
        ...prev,
        currentLevel: prev.currentLevel + 1,
        levelResults: newLevelResults,
        totalScore,
        totalTime,
      }));
      // Reset game state for the new level
      setGameState({
        pieces: [],
        isComplete: false,
        startTime: null,
        endTime: null,
        moves: 0,
        selectedPiece: null,
      });
      setCurrentLevelStartTime(new Date());
      setSubmitMessage(null);
      isProcessingLevelCompletion.current = false;
    } else {
      // Game completed
      setGameSession((prev) => ({
        ...prev,
        levelResults: newLevelResults,
        totalScore,
        totalTime,
        gameCompleted: true,
      }));
      // Update user profile with results
      updateUserProfile(gameSession.playerName, newLevelResults);
      setShowResultScreen(true);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  if (showResultScreen) {
    return (
      <ResultScreen
        levelResults={gameSession.levelResults}
        totalScore={gameSession.totalScore}
        totalTime={gameSession.totalTime}
        playerName={gameSession.playerName}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!gameSession.gameStarted) {
    return (
      <div className="app">
        <UserNameInput onStartGame={startGame} />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>🧩 Jigsaw Puzzle Challenge</h1>
          <p>Welcome, {gameSession.playerName}!</p>
          <p>{currentLevelData.name}</p>
        </header>

        <main className="app-main">
          <div className="game-container">
            <div className="left-panel">
              <LevelHeader
                currentLevel={gameSession.currentLevel}
                totalLevels={gameSession.totalLevels}
                isComplete={gameState.pieces.every((piece) => piece.isPlaced)}
                onSubmit={handleSubmit}
                canSubmit={gameState.pieces.every((piece) => piece.isPlaced)}
              />

              <Timer
                key={`timer-${gameSession.currentLevel}`}
                timeLimit={LEVEL_TIME_LIMIT}
                onTimeUp={handleTimeUp}
                isActive={gameSession.gameStarted && !gameState.isComplete}
              />

              {submitMessage && (
                <div
                  className={`submit-message ${
                    submitMessage.includes("Correct")
                      ? "success"
                      : submitMessage.includes("Incorrect")
                      ? "error"
                      : "info"
                  }`}
                >
                  {submitMessage}
                </div>
              )}

              <GameControls
                puzzleConfig={puzzleConfig}
                setPuzzleConfig={() => {}}
                onStartGame={() => {}}
                onResetGame={resetGame}
                isGameStarted={gameSession.gameStarted}
                isGameComplete={gameState.isComplete}
                pieces={gameState.pieces}
                onPiecesUpdate={updatePieces}
                selectedPiece={gameState.selectedPiece}
                onPieceSelect={(pieceId: string | null) =>
                  setGameState((prev) => ({ ...prev, selectedPiece: pieceId }))
                }
              />

              <GameStats
                gameState={gameState}
                isGameStarted={gameSession.gameStarted}
              />
            </div>

            <div className="center-panel">
              <PuzzleBoard
                pieces={gameState.pieces}
                puzzleConfig={puzzleConfig}
                onPiecesUpdate={updatePieces}
                selectedPiece={gameState.selectedPiece}
                onPieceSelect={(pieceId: string | null) =>
                  setGameState((prev) => ({ ...prev, selectedPiece: pieceId }))
                }
              />
            </div>

            <div className="right-panel">
              <div className="reference-image">
                <h3>Reference Image</h3>
                <img
                  src={puzzleConfig.imageUrl}
                  alt="Puzzle reference"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;
