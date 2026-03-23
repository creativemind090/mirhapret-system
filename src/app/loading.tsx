import { MirhaPretLogo } from '@/components/MirhaPretLogo';

export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          animation: 'mirhaPulse 1.6s ease-in-out infinite',
        }}
      >
        <MirhaPretLogo width={160} color="black" />
      </div>
      <style>{`
        @keyframes mirhaPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.94); }
        }
      `}</style>
    </div>
  );
}
