import React, { useState, useEffect, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

import { checkWinnerClassic } from '../utils/checkWinnerClassic';

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];

type GameResult = {
  winner: Player | "Draw" | null;
  line: number[] | null;
};

const initialBoard: Board = Array(9).fill(null);

const ClassicTicTacToe: React.FC = (): JSX.Element => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const { width, height } = useWindowSize();
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const handleClick = (index: number): void => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    const result = checkWinnerClassic(newBoard);
    setClickedIndex(index);
    setTimeout(() => {
      setBoard(newBoard);
      setIsXTurn(!isXTurn);
      setClickedIndex(null);
      setWinner(result.winner);
      setWinningLine(result.line);
    }, 100);
  };

  useEffect(() => {
    if (winner && (winner === 'Draw' || winningLine)) {
      const timeout = setTimeout(() => setShowOverlay(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [winner, winningLine]);

  const resetGame = (): void => {
    setBoard(initialBoard);
    setIsXTurn(true);
    setWinner(null);
    setWinningLine(null);
    setClickedIndex(null);
    setShowOverlay(false);
  };

  const getCellCenterPercent = (index: number): { x: number; y: number } => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      x: col * 33.333 + 16.666,
      y: row * 33.333 + 16.666
    };
  };

  const winnerPlayer = winner === 'X' ? 'Player 1' : winner === 'O' ? 'Player 2' : null;

  return (
    <div className="text-center pt-6 relative h-full w-full">
      <h2 className="text-2xl font-semibold mb-2">Classic Tic Tac Toe</h2>

      <div className="grid grid-cols-3 gap-2 justify-center max-w-xs mx-auto mb-6 relative">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            onClick={(): void => handleClick(index)}
            whileTap={{ scale: 0.9 }}
            className={`w-24 h-24 bg-gray-200 flex items-center justify-center text-3xl font-bold cursor-pointer transition duration-150
              ${clickedIndex === index ? 'ring-2 ring-blue-400' : ''}
              hover:bg-gray-300`}
          >
            {cell}
          </motion.div>
        ))}

        {winningLine && (
          <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            {(() => {
              const start = getCellCenterPercent(winningLine[0]);
              const end = getCellCenterPercent(winningLine[2]);
              return (
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="green"
                  strokeWidth={10}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 300,
                    strokeDashoffset: 300,
                    animation: 'drawLine 1s forwards ease-out'
                  }}
                />
              );
            })()}
          </svg>
        )}
      </div>

      <button
        onClick={resetGame}
        className="mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
      >
        Restart
      </button>
      <Link to="/">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition">
          Back to Menu
        </button>
      </Link>

      <AnimatePresence>
        {winner && showOverlay && (
          <motion.div
            className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-white px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {winner !== 'Draw' && <Confetti width={width} height={height} />} 
            <motion.h3
              className="text-3xl font-bold mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {winner === 'Draw' ? "🤝 It's a draw!" : `🎉 Winner: ${winnerPlayer}`}
            </motion.h3>
            <button
              onClick={resetGame}
              className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Play Again
            </button>
            <Link to="/">
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded">
                Back to Menu
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes drawLine {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ClassicTicTacToe;