import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import './ScoreBoard.css';
import ScoreBoard from './ScoreBoard'; // Import the ScoreBoard component

const GameBoard = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(localStorage.getItem('bestScore') || 0);
  const [gameOver, setGameOver] = useState(false);
  const [scoreChanged, setScoreChanged] = useState(false);
  const scoreRef = useRef(score);

  function initializeBoard() {
    let newBoard = Array(4).fill().map(() => Array(4).fill(null));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board) {
    let emptyTiles = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) emptyTiles.push({ row, col });
      }
    }
    if (emptyTiles.length) {
      let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function slideAndMerge(line) {
    let newLine = line.filter(tile => tile !== null);
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        setScore(prevScore => {
          const newScore = prevScore + newLine[i];
          setScoreChanged(true);
          return newScore;
        });
        newLine[i + 1] = null;
      }
    }
    newLine = newLine.filter(tile => tile !== null);
    while (newLine.length < 4) newLine.push(null);
    return newLine;
  }

  function rotateBoard(board) {
    let rotatedBoard = [];
    for (let col = 0; col < 4; col++) {
      let newRow = [];
      for (let row = 0; row < 4; row++) {
        newRow.push(board[row][col]);
      }
      rotatedBoard.push(newRow);
    }
    return rotatedBoard;
  }

  function isGameOver(board) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) return false;
        if (col < 3 && board[row][col] === board[row][col + 1]) return false;
        if (row < 3 && board[row][col] === board[row + 1][col]) return false;
      }
    }
    return true;
  }

  const move = (direction) => {
    let newBoard = [...board];
    let rotated = false;

    if (direction === 'left') {
      newBoard = newBoard.map(row => slideAndMerge(row));
    } else if (direction === 'right') {
      newBoard = newBoard.map(row => slideAndMerge(row.reverse()).reverse());
    } else if (direction === 'up') {
      newBoard = rotateBoard(newBoard);
      rotated = true;
      newBoard = newBoard.map(row => slideAndMerge(row));
    } else if (direction === 'down') {
      newBoard = rotateBoard(newBoard);
      rotated = true;
      newBoard = newBoard.map(row => slideAndMerge(row.reverse()).reverse());
    }

    if (rotated) newBoard = rotateBoard(newBoard);
    if (!areBoardsEqual(board, newBoard)) {
      addRandomTile(newBoard);
      setBoard(newBoard);

      // Update best score
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('bestScore', score);
      }

      // Check if game is over
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  function areBoardsEqual(board1, board2) {
    return JSON.stringify(board1) === JSON.stringify(board2);
  }

  const restartGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setScoreChanged(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowUp') move('up');
      else if (e.key === 'ArrowDown') move('down');
      else if (e.key === 'ArrowLeft') move('left');
      else if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, score, gameOver]);

  useEffect(() => {
    if (score !== scoreRef.current) {
      scoreRef.current = score;
      setScoreChanged(true);
      const timer = setTimeout(() => setScoreChanged(false), 500);
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <div className="game-container">
      <div className={`score-board ${scoreChanged ? 'increase' : ''}`}>
        <div className={`score ${scoreChanged ? 'increase' : ''}`}>Score: {score}</div>
        <div className="best-score">Best Score: {bestScore}</div>
      </div>
      <button className="restart-button" onClick={restartGame}>
        Restart
      </button>
      {gameOver && <div className="overlay">
        <div className="overlay-message">
          Game Over<br />
          <button className="restart-button" onClick={restartGame}>Try Again</button>
        </div>
      </div>}
      <div className={`game-board ${gameOver ? 'blurred' : ''}`}>
        {board.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`tile tile-${tile}`}>
              {tile}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;