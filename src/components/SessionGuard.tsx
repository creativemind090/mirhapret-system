'use client';

import { useEffect, useState } from 'react';
import { tokenExpiresInMinutes } from '@/lib/api';

/**
 * Shows a warning banner when the JWT is about to expire (≤5 min left).
 * Listens for the 'auth:expired' event emitted by api.ts interceptor.
 */
export function SessionGuard() {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      const min = tokenExpiresInMinutes();
      if (min !== null && min <= 5 && min > 0) {
        setMinutesLeft(min);
      } else {
        setMinutesLeft(null);
      }
    };

    check();
    const interval = setInterval(check, 60_000); // check every minute

    const handleExpired = () => {
      // api.ts already redirects; this is a fallback clear
    };
    window.addEventListener('auth:expired', handleExpired);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:expired', handleExpired);
    };
  }, []);

  if (!minutesLeft || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: '#1a1a1a',
      color: '#fff',
      padding: '14px 20px',
      maxWidth: '340px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      borderLeft: '3px solid #c8a96e',
      fontSize: '13px',
      lineHeight: 1.5,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div>
          <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#c8a96e' }}>Session expiring soon</p>
          <p style={{ margin: 0, color: '#ccc' }}>
            Your session expires in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}.{' '}
            <a href="/signin" style={{ color: '#c8a96e', textDecoration: 'underline' }}>Sign in again</a> to continue.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', color: '#666', fontSize: '18px', cursor: 'pointer', padding: 0, lineHeight: 1 }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
