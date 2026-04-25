import { useState } from 'react';
import { toggleMute, isMuted } from '../utils/soundEngine';

/**
 * MuteButton — Floating toggle to mute/unmute all game sounds.
 */
export default function MuteButton() {
  const [muted, setMuted] = useState(isMuted());

  const handleToggle = () => {
    const nowMuted = toggleMute();
    setMuted(nowMuted);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: muted ? 'var(--text-secondary)' : 'var(--primary)',
        fontSize: '1.25rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
