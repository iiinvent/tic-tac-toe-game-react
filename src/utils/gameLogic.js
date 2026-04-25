/**
 * All 8 possible winning combinations on a 3×3 board.
 * Each sub-array contains the three cell indices that form a winning line.
 */
export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left → bottom-right
  [2, 4, 6], // Diagonal top-right → bottom-left
];

/**
 * Checks the current board state for a winner.
 * @param {Array<string|null>} squares - The 9-cell board array.
 * @returns {{ winner: string, line: number[] } | null}
 *   An object with the winner symbol and winning indices, or null if no winner yet.
 */
export function calculateWinner(squares) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

/**
 * Determines if the game is a draw.
 * A draw occurs when all squares are filled and there is no winner.
 * @param {Array<string|null>} squares - The 9-cell board array.
 * @param {object|null} winnerInfo - Result from calculateWinner.
 * @returns {boolean}
 */
export function isDraw(squares, winnerInfo) {
  return !winnerInfo && squares.every((cell) => cell !== null);
}
