import { useState } from 'react';

/**
 * Cell — A single square on the Tic Tac Toe board.
 *
 * Props:
 *   value       {string|null} - 'X', 'O', or null
 *   onClick     {function}    - Handler called when the cell is clicked
 *   isWinning   {boolean}     - Whether this cell is part of the winning line
 *   isDisabled  {boolean}     - Whether clicks should be ignored
 *   currentPlayer {string}   - 'X' or 'O' (used for hover preview)
 */
export default function Cell({ value, onClick, isWinning, isDisabled, currentPlayer }) {
  const [hovered, setHovered] = useState(false);

  const isEmpty = value === null;
  const showHoverPreview = hovered && isEmpty && !isDisabled;

  // Determine the symbol color
  const symbolColor = value === 'X'
    ? 'var(--x-color)'
    : value === 'O'
    ? 'var(--o-color)'
    : 'transparent';

  const hoverColor = currentPlayer === 'X'
    ? 'rgba(158, 127, 255, 0.25)'
    : 'rgba(244, 114, 182, 0.25)';

  const cellStyle = {
    position: 'relative',
    width: '100%',
    aspectRatio: '1',
    background: isWinning
      ? 'linear-gradient(135deg, rgba(158,127,255,0.18) 0%, rgba(244,114,182,0.12) 100%)'
      : hovered && !isDisabled && isEmpty
      ? 'rgba(255,255,255,0.04)'
      : 'var(--surface)',
    border: isWinning
      ? '2px solid rgba(158,127,255,0.6)'
      : '2px solid var(--border)',
    borderRadius: '16px',
    cursor: isDisabled || !isEmpty ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: isWinning
      ? 'scale(1.04)'
      : hovered && !isDisabled && isEmpty
      ? 'scale(1.03)'
      : 'scale(1)',
    boxShadow: isWinning
      ? '0 0 32px rgba(158,127,255,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
      : hovered && !isDisabled && isEmpty
      ? '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)'
      : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
    animation: isWinning ? 'winPulse 1.8s ease-in-out infinite' : 'none',
    overflow: 'hidden',
  };

  const symbolStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: 900,
    color: symbolColor,
    lineHeight: 1,
    userSelect: 'none',
    animation: value ? 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
    textShadow: isWinning
      ? value === 'X'
        ? '0 0 20px rgba(158,127,255,0.8)'
        : '0 0 20px rgba(244,114,182,0.8)'
      : 'none',
    letterSpacing: '-0.02em',
  };

  const hoverPreviewStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: 900,
    color: hoverColor,
    lineHeight: 1,
    userSelect: 'none',
    letterSpacing: '-0.02em',
    transition: 'opacity 0.15s ease',
  };

  return (
    <button
      style={cellStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={isDisabled || !isEmpty}
      aria-label={value ? `Cell filled with ${value}` : 'Empty cell'}
    >
      {/* Winning shimmer overlay */}
      {isWinning && (
        <span style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
          borderRadius: '14px',
          pointerEvents: 'none',
        }} />
      )}

      {/* Actual symbol or hover preview */}
      {value ? (
        <span style={symbolStyle}>{value}</span>
      ) : showHoverPreview ? (
        <span style={hoverPreviewStyle}>{currentPlayer}</span>
      ) : null}
    </button>
  );
}
