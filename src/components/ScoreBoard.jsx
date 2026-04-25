import { useRef, useEffect } from 'react';

/**
 * ScoreCard — Displays the score for a single player or draw.
 */
function ScoreCard({ label, score, color, prevScore }) {
  const scoreRef = useRef(null);

  // Animate score bump when it changes
  useEffect(() => {
    if (score !== prevScore && scoreRef.current) {
      scoreRef.current.style.animation = 'none';
      // Force reflow
      void scoreRef.current.offsetHeight;
      scoreRef.current.style.animation = 'scoreCount 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }, [score, prevScore]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      padding: '16px 24px',
      background: 'var(--surface)',
      borderRadius: '14px',
      border: '1px solid var(--border)',
      minWidth: '80px',
      flex: 1,
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color,
      }}>
        {label}
      </span>
      <span
        ref={scoreRef}
        style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color,
          lineHeight: 1,
          display: 'inline-block',
        }}
      >
        {score}
      </span>
    </div>
  );
}

/**
 * ScoreBoard — Shows wins for X, draws, and wins for O.
 *
 * Props:
 *   scores    {{ x: number, o: number, draws: number }}
 *   prevScores {{ x: number, o: number, draws: number }}
 */
export default function ScoreBoard({ scores, prevScores }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      width: '100%',
      maxWidth: '360px',
      animation: 'fadeInDown 0.5s ease forwards',
    }}>
      <ScoreCard
        label="Player X"
        score={scores.x}
        color="var(--x-color)"
        prevScore={prevScores.x}
      />
      <ScoreCard
        label="Draws"
        score={scores.draws}
        color="var(--text-secondary)"
        prevScore={prevScores.draws}
      />
      <ScoreCard
        label="Player O"
        score={scores.o}
        color="var(--o-color)"
        prevScore={prevScores.o}
      />
    </div>
  );
}
