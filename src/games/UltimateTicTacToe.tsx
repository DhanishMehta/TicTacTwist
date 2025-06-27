import React, { useState, useEffect, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

import { checkWinnerClassic } from '../utils/checkWinnerClassic';

type Player = "X" | "O";
type Cell = Player | null;
type MiniBoard = Cell[];
type UltimateBoard = MiniBoard[];

const initialMiniBoard: MiniBoard = Array(9).fill(null);
const initialUltimateBoard: UltimateBoard = Array(9).fill(null).map(() => [...initialMiniBoard]);

const UltimateTicTacToe: React.FC = (): JSX.Element => {
  const [ultimateBoard, setUltimateBoard] = useState<UltimateBoard>(initialUltimateBoard);
  const [activeBoardIndex, setActiveBoardIndex] = useState<number | null>(null);
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [mainBoardWinners, setMainBoardWinners] = useState<MiniBoard>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const { width, height } = useWindowSize();

  const handleMiniBoardClick = (boardIdx: number, cellIdx: number): void => {
    if (winner || mainBoardWinners[boardIdx] || ultimateBoard[boardIdx][cellIdx]) return;
    if (activeBoardIndex !== null && boardIdx !== activeBoardIndex) return;

    const newUltimateBoard = [...ultimateBoard];
    newUltimateBoard[boardIdx] = [...newUltimateBoard[boardIdx]];
    newUltimateBoard[boardIdx][cellIdx] = isXTurn ? "X" : "O";

    const miniResult = checkWinnerClassic(newUltimateBoard[boardIdx]);
    const newMainBoardWinners = [...mainBoardWinners];
    if (miniResult.winner && miniResult.winner !== 'Draw') {
      newMainBoardWinners[boardIdx] = miniResult.winner;
    }

    const mainResult = checkWinnerClassic(newMainBoardWinners);

    setUltimateBoard(newUltimateBoard);
    setMainBoardWinners(newMainBoardWinners);
    setActiveBoardIndex(newMainBoardWinners[cellIdx] || newUltimateBoard[cellIdx].every(c => c !== null) ? null : cellIdx);
    setIsXTurn(!isXTurn);
    setWinner(mainResult.winner);
  };

  useEffect(() => {
    if (winner) {
      const timeout = setTimeout(() => setShowOverlay(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [winner]);

  const resetGame = (): void => {
    setUltimateBoard(initialUltimateBoard);
    setMainBoardWinners(Array(9).fill(null));
    setIsXTurn(true);
    setActiveBoardIndex(null);
    setWinner(null);
    setShowOverlay(false);
  };

  const renderMiniBoard = (board: MiniBoard, boardIdx: number): JSX.Element => (
    <div
      className={`relative grid grid-cols-3 gap-1 bg-white p-1 ${mainBoardWinners[boardIdx] ? 'opacity-50' : ''} ${activeBoardIndex === null || activeBoardIndex === boardIdx ? 'border-2 border-blue-500' : ''}`}
    >
      {board.map((cell, cellIdx) => (
        <motion.div
          key={cellIdx}
          onClick={() => handleMiniBoardClick(boardIdx, cellIdx)}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-200 flex items-center justify-center text-xl sm:text-2xl font-bold cursor-pointer hover:bg-gray-300"
        >
          {cell}
        </motion.div>
      ))}
      {mainBoardWinners[boardIdx] && (
        <div className={`absolute inset-0 flex items-center justify-center text-8xl font-bold ${mainBoardWinners[boardIdx] === 'X' ? 'text-blue-600' : 'text-red-600'}`}>{mainBoardWinners[boardIdx]}</div>
      )}
    </div>
  );

  const winnerPlayer = winner === 'X' ? 'Player 1' : winner === 'O' ? 'Player 2' : null;

  return (
    <div className="text-center p-6 relative h-full w-full overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Ultimate Tic Tac Toe</h2>
<p className="text-lg font-medium text-gray-700 mb-4">Current Turn: <span className="text-blue-600">{isXTurn ? 'Player 1 (X)' : 'Player 2 (O)'}</span></p>

      <button
        onClick={() => setShowRules(true)}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Show Rules
      </button>

      <div className="grid grid-cols-3 gap-3 justify-center mx-auto max-w-2xl">
        {ultimateBoard.map((board, idx) => (
          <div key={idx}>{renderMiniBoard(board, idx)}</div>
        ))}
      </div>

      <div className="mt-6">
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
      </div>

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

        {showRules && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/70 flex flex-col items-center justify-center text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white text-black p-6 rounded-lg max-w-xl text-left">
              <h3 className="text-2xl font-bold mb-4">How to Play Ultimate Tic Tac Toe</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>The game board is a 3×3 grid of smaller Tic Tac Toe boards.</li>
                <li>Players take turns playing X or O in the small boards.</li>
                <li>Where you play in your small board sends the next player to that corresponding board.</li>
                <li>If a board is already won or full, the next player can choose any board.</li>
                <li>Win a small board to claim that cell in the large board.</li>
                <li>The first player to win three small boards in a row on the big board wins the game!</li>
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

export default UltimateTicTacToe;