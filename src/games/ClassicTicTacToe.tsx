import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkWinner } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

const initialBoard: ("X" | "O" | null)[] = Array(9).fill(null);

const ClassicTicTacToe: React.FC = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [, setShowResult] = useState(false);
  const { width, height } = useWindowSize();

  const winner = checkWinner(board);

  function handleClick(index: number) {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  }

  function resetGame() {
    setBoard(initialBoard);
    setIsXTurn(true);
    setShowResult(false);
  }

  return (
    <div className="text-center pt-6 relative h-full w-full">
      <h2 className="text-2xl font-semibold mb-2">Classic Tic Tac Toe</h2>
      <p className="text-gray-600 mb-4">Take turns placing X and O. First to get 3 in a row wins!</p>

      <div className="grid grid-cols-3 gap-2 justify-center max-w-xs mx-auto mb-6">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 bg-gray-200 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-gray-300 transition"
          >
            {cell}
          </div>
        ))}
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
        {winner && (
          <motion.div
            className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center text-white px-6"
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
              {winner === 'Draw' ? "🤝 It's a draw!" : `🎉 Winner: ${winner}`}
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
    </div>
  );
};

export default ClassicTicTacToe;