// utils/checkWinnerClassic.ts

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export type GameResult = {
  winner: Player | "Draw" | null;
  line: number[] | null;
};

export function checkWinnerClassic(board: Board): GameResult {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  const isDraw = board.every(cell => cell !== null);
  return { winner: isDraw ? "Draw" : null, line: null };
}
