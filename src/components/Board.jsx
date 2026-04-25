import Cell from './Cell';

/**
 * Board — Renders the 3×3 grid of cells.
 *
 * Props:
 *   squares       {Array<string|null>} - 9-element array of cell values
 *   onCellClick   {function}           - Called with cell index when clicked
 *   winningLine   {number[]|null}      - Indices of the winning cells (or null)
 *   gameOver      {boolean}            - Whether the game has ended
 *   currentPlayer {string}             - 'X' or 'O'
 */
export default function Board({ squares, onCellClick, winningLine, gameOver, currentPlayer }) {
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    width: '100%',
    maxWidth: '360px',
    animation: 'boardReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
  };

  return (
    <div style={boardStyle} role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={winningLine ? winningLine.includes(index) : false}
          isDisabled={gameOver || value !== null}
          currentPlayer={currentPlayer}
        />
      ))}
    </div>
  );
}
