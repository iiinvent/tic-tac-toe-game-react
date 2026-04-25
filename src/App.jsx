import { useState, useCallback, useRef, useEffect } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import StatusMessage from './components/StatusMessage';
import MuteButton from './components/MuteButton';
import { calculateWinner, isDraw } from './utils/gameLogic';
import { getBestMove } from './utils/aiLogic';
import { play, playPlayerMove, playComputerMove, playWin, playLoss, playDraw } from './utils/soundEngine';

const INITIAL_SQUARES = Array(9).fill(null);
const COMPUTER_DELAY_MS = 500;

export default function App() {
  const [squares, setSquares] = useState([...INITIAL_SQUARES]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [prevScores, setPrevScores] = useState({ x: 0, o: 0, draws: 0 });
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const scoreUpdated = useRef(false);

  const winnerInfo = calculateWinner(squares);
  const draw = isDraw(squares, winnerInfo);
  const gameOver = Boolean(winnerInfo) || draw;
  const currentPlayer = isXTurn ? 'X' : 'O';

  // ── Score updater ─────────────────────────────────────────────────────────
  const updateScores = useCallback((nextSquares) => {
    if (scoreUpdated.current) return;
    const result = calculateWinner(nextSquares);
    const nowDraw = isDraw(nextSquares, result);

    if (result) {
      scoreUpdated.current = true;
      setPrevScores((prev) => ({ ...prev }));
      setScores((prev) => ({
        ...prev,
        [result.winner.toLowerCase()]: prev[result.winner.toLowerCase()] + 1,
      }));
      // X = human win, O = human loss
      play(result.winner === 'X' ? playWin : playLoss);
    } else if (nowDraw) {
      scoreUpdated.current = true;
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      play(playDraw);
    }
  }, []);

  // ── Human move ────────────────────────────────────────────────────────────
  const handleCellClick = useCallback((index) => {
    if (squares[index] || gameOver || !isXTurn || isComputerThinking) return;

    play(playPlayerMove);

    const nextSquares = [...squares];
    nextSquares[index] = 'X';
    setSquares(nextSquares);
    updateScores(nextSquares);

    const result = calculateWinner(nextSquares);
    const nowDraw = isDraw(nextSquares, result);
    if (!result && !nowDraw) {
      setIsXTurn(false);
    }
  }, [squares, gameOver, isXTurn, isComputerThinking, updateScores]);

  // ── Computer move ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isXTurn || gameOver) return;

    setIsComputerThinking(true);

    const timer = setTimeout(() => {
      const bestMove = getBestMove(squares);
      if (bestMove === -1) return;

      play(playComputerMove);

      const nextSquares = [...squares];
      nextSquares[bestMove] = 'O';
      setSquares(nextSquares);
      updateScores(nextSquares);

      const result = calculateWinner(nextSquares);
      const nowDraw = isDraw(nextSquares, result);
      if (!result && !nowDraw) {
        setIsXTurn(true);
      }

      setIsComputerThinking(false);
    }, COMPUTER_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isXTurn, gameOver, squares, updateScores]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSquares([...INITIAL_SQUARES]);
    setIsXTurn(true);
    setIsComputerThinking(false);
    scoreUpdated.current = false;
  }, []);

  // ── Styles ────────────────────────────────────────────────────────────────
  const containerStyle = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '40px 24px',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center',
    animation: 'fadeInDown 0.6s ease forwards',
  };

  const titleStyle = {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    background: 'linear-gradient(135deg, var(--x-color) 0%, var(--secondary) 50%, var(--o-color) 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'shimmer 4s linear infinite',
    marginBottom: '6px',
  };

  const subtitleStyle = {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  };

  const dividerStyle = {
    width: '100%',
    maxWidth: '360px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
  };

  const statusCardStyle = {
    width: '100%',
    maxWidth: '360px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '20px 24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
    animation: 'fadeInUp 0.5s ease forwards',
  };

  const resetButtonStyle = {
    padding: '14px 40px',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#fff',
    background: gameOver
      ? 'linear-gradient(135deg, var(--primary) 0%, var(--o-color) 100%)'
      : 'var(--surface2)',
    border: gameOver ? 'none' : '1px solid var(--border)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: gameOver
      ? '0 4px 20px rgba(158,127,255,0.35)'
      : '0 2px 8px rgba(0,0,0,0.2)',
    fontFamily: 'inherit',
    animation: 'fadeInUp 0.6s ease forwards',
  };

  return (
    <>
      <MuteButton />
      <main style={containerStyle}>
        {/* ── Header ── */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>Tic Tac Toe</h1>
          <p style={subtitleStyle}>You vs Computer · Classic Edition</p>
        </header>

        {/* ── Score Board ── */}
        <ScoreBoard scores={scores} prevScores={prevScores} />

        <div style={dividerStyle} />

        {/* ── Status Message ── */}
        <div style={statusCardStyle}>
          <StatusMessage
            winner={winnerInfo?.winner ?? null}
            isDraw={draw}
            currentPlayer={currentPlayer}
            isComputerThinking={isComputerThinking}
          />
        </div>

        {/* ── Game Board ── */}
        <Board
          squares={squares}
          onCellClick={handleCellClick}
          winningLine={winnerInfo?.line ?? null}
          gameOver={gameOver}
          currentPlayer={currentPlayer}
          isComputerThinking={isComputerThinking}
        />

        {/* ── Reset Button ── */}
        <button
          style={resetButtonStyle}
          onClick={handleReset}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = gameOver
              ? '0 8px 30px rgba(158,127,255,0.5)'
              : '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = gameOver
              ? '0 4px 20px rgba(158,127,255,0.35)'
              : '0 2px 8px rgba(0,0,0,0.2)';
          }}
          aria-label="Reset game"
        >
          {gameOver ? '🎮 Play Again' : '↺ Reset Board'}
        </button>
      </main>
    </>
  );
}
