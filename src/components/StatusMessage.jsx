/**
 * StatusMessage — Displays the current game state to the user.
 *
 * Props:
 *   winner              {string|null}  - 'X', 'O', or null
 *   isDraw              {boolean}
 *   currentPlayer       {string}       - 'X' or 'O'
 *   isComputerThinking  {boolean}      - true while AI is calculating
 */
export default function StatusMessage({ winner, isDraw, currentPlayer, isComputerThinking }) {
  let message;
  let subMessage;
  let accentColor;

  if (winner) {
    message = winner === 'X' ? '🎉 You Win!' : '🤖 Computer Wins!';
    subMessage = winner === 'X' ? 'Excellent play!' : 'Better luck next time';
    accentColor = winner === 'X' ? 'var(--x-color)' : 'var(--o-color)';
  } else if (isDraw) {
    message = "It's a Draw!";
    subMessage = 'Well played by both sides';
    accentColor = 'var(--text-secondary)';
  } else if (isComputerThinking) {
    message = '🤖 Computer is thinking…';
    subMessage = 'Calculating best move';
    accentColor = 'var(--o-color)';
  } else {
    message = 'Your Turn';
    subMessage = 'You are playing as X';
    accentColor = 'var(--x-color)';
  }

  return (
    <div
      key={message}
      style={{
        textAlign: 'center',
        animation: 'statusSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {/* Indicator dot */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '4px',
      }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: accentColor,
          display: 'inline-block',
          boxShadow: `0 0 10px ${accentColor}`,
          animation: !winner && !isDraw ? 'pulse 1.5s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }} />
        <h2 style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          fontWeight: 800,
          color: accentColor,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        }}>
          {message}
        </h2>
      </div>
      <p style={{
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        {subMessage}
      </p>
    </div>
  );
}
