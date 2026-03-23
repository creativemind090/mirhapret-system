'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#faf9f6',
        fontFamily: 'Georgia, serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '2rem', letterSpacing: '0.3em', fontSize: '0.75rem', color: '#8b7355', textTransform: 'uppercase' }}>
        MirhaPret
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#6b6b6b', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: 1.6 }}>
        We encountered an unexpected error. Please try again or return to our collection.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: '#1a1a1a',
            border: '1px solid #1a1a1a',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
