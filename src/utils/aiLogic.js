import { calculateWinner, isDraw } from './gameLogic';

/**
 * Minimax algorithm — recursively evaluates all possible game states.
 * Returns a score: +10 for O win, -10 for X win, 0 for draw.
 *
 * @param {Array<string|null>} squares - Current board state
 * @param {boolean} isMaximizing - true when it's O's turn (computer)
 * @param {number} depth - Current recursion depth (used to prefer faster wins)
 * @returns {number} Score of the board state
 */
function minimax(squares, isMaximizing, depth = 0) {
  const result = calculateWinner(squares);
  if (result) return result.winner === 'O' ? 10 - depth : depth - 10;
  if (isDraw(squares, result)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'O';
        best = Math.max(best, minimax(next, false, depth + 1));
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const next = [...squares];
        next[i] = 'X';
        best = Math.min(best, minimax(next, true, depth + 1));
      }
    }
    return best;
  }
}

/**
 * getBestMove — Returns the optimal cell index for the computer (Player O).
 * Uses minimax to evaluate all possible moves and picks the best one.
 *
 * @param {Array<string|null>} squares - Current board state
 * @returns {number} Index of the best move for O
 */
export function getBestMove(squares) {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const next = [...squares];
      next[i] = 'O';
      const score = minimax(next, false, 1);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}
