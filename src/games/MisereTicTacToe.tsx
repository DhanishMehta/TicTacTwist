import React, { useState, useEffect, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

import { checkWinnerClassic } from '../utils/checkWinnerClassic';

type Player = 'X' | 'O';
type Cell = Player | null;

type GameState = Cell[];

const MisereTicTacToe: React.FC = (): JSX.Element => {
  const getLineStyle = (line: number[]): React.CSSProperties => {
    const lineMap: { [key: string]: React.CSSProperties } = {
      '0,1,2': { top: '16.66%', left: 0, width: '100%', height: '4px' },
      '3,4,5': { top: '50%', left: 0, width: '100%', height: '4px' },
      '6,7,8': { bottom: '16.66%', left: 0, width: '100%', height: '4px' },
      '0,3,6': { top: 0, left: '16.66%', width: '4px', height: '100%' },
      '1,4,7': { top: 0, left: '50%', width: '4px', height: '100%' },
      '2,5,8': { top: 0, right: '16.66%', width: '4px', height: '100%' },
      '0,4,8': { top: 0, left: 0, width: '100%', height: '4px', transform: 'rotate(45deg)', transformOrigin: 'top left' },
      '2,4,6': { top: 0, right: 0, width: '100%', height: '4px', transform: 'rotate(-45deg)', transformOrigin: 'top right' },
    };
    return lineMap[line.join(',')] || {};
  };
  const [board, setBoard] = useState<GameState>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [loser, setLoser] = useState<Player | 'Draw' | null>(null);
  const [losingLine, setLosingLine] = useState<number[] | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const handleClick = (index: number): void => {
    if (board[index] || loser) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    const result = checkWinnerClassic(newBoard);

    setBoard(newBoard);
    setIsXTurn(!isXTurn);
    if (result.winner && result.winner !== 'Draw') {
      setLoser(result.winner);
      setLosingLine(result.line);
    }
    if (result.winner === 'Draw') {
      setLoser('Draw');
      setLosingLine(null);
    }
  };

  useEffect(() => {
    if (loser) {
      const timeout = setTimeout(() => setShowOverlay(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [loser]);

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setLoser(null);
    setShowOverlay(false);
    setLosingLine(null);
  };

  const loserPlayer = loser === 'X' ? 'Player 1' : loser === 'O' ? 'Player 2' : null;

  return (
    <div className="text-center p-6 relative h-full w-full overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Misère Tic Tac Toe</h2>
      <p className="text-lg font-medium text-gray-700 mb-4">Current Turn: <span className="text-blue-600">{isXTurn ? 'Player 1 (X)' : 'Player 2 (O)'}</span></p>

      <button
        onClick={() => setShowRules(true)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Show Rules
      </button>

      <div className="relative grid grid-cols-3 gap-3 justify-center mx-auto max-w-xs aspect-square">
        {board.map((cell, idx) => (
          <motion.div
            key={idx}
            onClick={() => handleClick(idx)}
            whileTap={{ scale: 0.9 }}
            className="aspect-square w-full bg-gray-200 flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-gray-300"
          >
            {cell}
          </motion.div>
        ))}
      {losingLine && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <motion.div
              className="absolute bg-red-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                transformOrigin: 'left',
                ...getLineStyle(losingLine),
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={resetGame}
          className="mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Restart
        </button>
        <Link to="/">
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Back to Menu
          </button>
        </Link>
      </div>

      <AnimatePresence>
        {loser && showOverlay && (
          <motion.div
            className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-white px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loser !== 'Draw' && <Confetti width={width} height={height} />} 
            <motion.h3
              className="text-3xl font-bold mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {loser === 'Draw' ? "🤝 It's a draw!" : `💀 Loser: ${loserPlayer}`}
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

        {showRules && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/70 flex flex-col items-center justify-center text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white text-black p-6 rounded-lg max-w-xl text-left">
              <h3 className="text-2xl font-bold mb-4">How to Play Misère Tic Tac Toe</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>This is the inverse of classic Tic Tac Toe.</li>
                <li>Two players alternate marking the spaces in a 3×3 grid with X and O.</li>
                <li>The first player to get three in a row **loses** the game.</li>
                <li>If all squares are filled and no three-in-a-row occurs, the game ends in a draw.</li>
                <li>Player 1 starts with X, Player 2 plays with O.</li>
              </ul>
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowRules(false)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MisereTicTacToe;