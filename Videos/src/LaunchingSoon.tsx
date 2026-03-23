import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Design tokens ─────────────────────────────────────────────
const GOLD = "#c8a96e";
const GOLD_DARK = "#a8894e";
const GOLD_LIGHT = "#e8c98e";
const BLACK = "#0a0a0a";
const OFF_WHITE = "#f5f4f0";
const WARM_WHITE = "#fff8f0";

// ── Easing ────────────────────────────────────────────────────
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ── Particle spark ────────────────────────────────────────────
const Particle: React.FC<{
  x: number; y: number; delay: number; size: number; opacity: number;
}> = ({ x, y, delay, size, opacity }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay) / 55;
  const alpha = interpolate(t, [0, 0.3, 0.7, 1], [0, opacity, opacity, 0], { extrapolateRight: "clamp" });
  const drift = interpolate(t, [0, 1], [0, -28], { extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: x, top: y + drift,
      width: size, height: size, borderRadius: "50%",
      background: `radial-gradient(circle, ${GOLD_LIGHT}, ${GOLD})`,
      opacity: alpha, filter: `blur(${size * 0.3}px)`,
    }} />
  );
};

// ── Ornamental line ───────────────────────────────────────────
const OrnamentalLine: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", justifyContent: "center" }}>
    <div style={{ height: 1, background: `linear-gradient(to left, ${GOLD}, transparent)`, width: 180 * progress, opacity: 0.7 }} />
    <div style={{ width: 6, height: 6, background: GOLD, transform: `rotate(45deg) scale(${progress})`, opacity: progress }} />
    <div style={{ width: 10, height: 10, border: `1.5px solid ${GOLD}`, transform: `rotate(45deg) scale(${progress})`, opacity: progress * 0.8 }} />
    <div style={{ width: 6, height: 6, background: GOLD, transform: `rotate(45deg) scale(${progress})`, opacity: progress }} />
    <div style={{ height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)`, width: 180 * progress, opacity: 0.7 }} />
  </div>
);

// ── Gold shimmer overlay ──────────────────────────────────────
const Shimmer: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: `linear-gradient(
      105deg,
      transparent 0%,
      rgba(200,169,110,0.08) ${40 + progress * 20}%,
      rgba(200,169,110,0.18) ${50 + progress * 20}%,
      rgba(200,169,110,0.08) ${60 + progress * 20}%,
      transparent 100%
    )`,
  }} />
);

// ── Main composition ──────────────────────────────────────────
export const LaunchingSoon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Particles
  const particles = React.useMemo(() => {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      pts.push({
        x: Math.random() * 1080,
        y: Math.random() * 1920,
        delay: Math.floor(Math.random() * 200),
        size: 3 + Math.random() * 8,
        opacity: 0.2 + Math.random() * 0.5,
      });
    }
    return pts;
  }, []);

  const bgPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5),
    [-1, 1], [0, 0.04],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Scene 1: MIRHA letters (0–40f) ───────────────────────
  const mirhaLetters = ["M", "I", "R", "H", "A"];
  const mirhaProgress = mirhaLetters.map((_, i) =>
    spring({ frame: frame - i * 5, fps, config: { damping: 14, stiffness: 120 } })
  );

  // ── Scene 2: PRET (35–65f) ────────────────────────────────
  const pretSlide = spring({ frame: frame - 35, fps, config: { damping: 16, stiffness: 100 } });
  const pretOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Scene 3: Tagline (80–120f) ────────────────────────────
  const taglineOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [80, 118], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const ornamentProgress = interpolate(frame, [100, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  // ── Scene 4: Urdu + Lahore (155–210f) ─────────────────────
  const urduOpacity = interpolate(frame, [155, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lahoreOpacity = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lahoreScale = spring({ frame: frame - 180, fps, config: { damping: 18, stiffness: 80 } });

  // ── Scene 5: COMING SOON (230–280f) ──────────────────────
  const comingSoonY = interpolate(frame, [230, 265], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const comingSoonOpacity = interpolate(frame, [230, 265], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const soonScale = spring({ frame: frame - 248, fps, config: { damping: 20, stiffness: 70 } });

  // ── Scene 6: Handle (310–360f) ────────────────────────────
  const handleOpacity = interpolate(frame, [310, 345], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handleY = interpolate(frame, [310, 350], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  // ── Shimmer (360–420f) ────────────────────────────────────
  const shimmerProgress = interpolate(frame, [360, 420], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BLACK, fontFamily: "'Georgia', 'Times New Roman', serif", overflow: "hidden" }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 700px 900px at 50% 40%, rgba(200,169,110,${0.06 + bgPulse}) 0%, transparent 70%),
          radial-gradient(ellipse 400px 400px at 20% 80%, rgba(200,169,110,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 300px 300px at 80% 15%, rgba(200,169,110,0.03) 0%, transparent 60%)
        `,
      }} />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Top ornament */}
      <div style={{
        position: "absolute", top: 120, left: 60, right: 60,
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}80, transparent)` }} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 18, letterSpacing: 8, color: `${GOLD}90`, textTransform: "uppercase" }}>
            Est. 2026 · Lahore
          </span>
        </div>
      </div>

      {/* MIRHA + PRET */}
      <div style={{
        position: "absolute", top: 580, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4,
      }}>
        {mirhaLetters.map((letter, i) => (
          <span key={i} style={{
            fontSize: 148, fontWeight: 400, fontFamily: "'Georgia', serif", letterSpacing: 2,
            background: `linear-gradient(160deg, ${GOLD_LIGHT} 0%, ${GOLD} 40%, ${GOLD_DARK} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            opacity: mirhaProgress[i],
            transform: `translateY(${(1 - mirhaProgress[i]) * 40}px)`,
            display: "inline-block", lineHeight: 1,
          }}>{letter}</span>
        ))}
        <span style={{
          fontSize: 148, fontWeight: 400, fontFamily: "'Georgia', serif",
          color: OFF_WHITE, opacity: pretOpacity,
          transform: `translateX(${(1 - pretSlide) * 30}px)`,
          display: "inline-block", lineHeight: 1, marginLeft: 8,
        }}>PRET</span>
      </div>

      {/* Sub-brand underline */}
      <div style={{ position: "absolute", top: 770, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: pretOpacity }}>
        <div style={{ height: 1, width: 600 * pretSlide, background: `linear-gradient(to right, transparent, ${GOLD}60, transparent)` }} />
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", top: 820, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
        opacity: taglineOpacity, transform: `translateY(${taglineY}px)`,
      }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 28, letterSpacing: 6, color: `${GOLD}cc`, textTransform: "uppercase", fontWeight: 300 }}>
          Where Lahore Meets Luxury
        </span>
        <OrnamentalLine progress={ornamentProgress} />
      </div>

      {/* Urdu */}
      <div style={{
        position: "absolute", top: 1020, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        opacity: urduOpacity,
      }}>
        <span style={{ fontSize: 64, color: WARM_WHITE, fontFamily: "'Times New Roman', serif", direction: "rtl", letterSpacing: 2 }}>
          جلد آ رہا ہے
        </span>
        <span style={{ fontFamily: "sans-serif", fontSize: 18, letterSpacing: 4, color: `${GOLD}80`, textTransform: "uppercase", fontWeight: 300 }}>
          Something beautiful is on its way
        </span>
      </div>

      {/* Lahore stamp */}
      <div style={{
        position: "absolute", top: 1190, left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: lahoreOpacity, transform: `scale(${lahoreScale})`,
      }}>
        <div style={{ border: `1px solid ${GOLD}40`, borderRadius: 2, padding: "12px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, letterSpacing: 5, color: `${GOLD}70`, textTransform: "uppercase" }}>Crafted in</span>
          <span style={{ fontFamily: "sans-serif", fontSize: 22, letterSpacing: 6, color: GOLD, textTransform: "uppercase", fontWeight: 600 }}>Lahore, Pakistan</span>
        </div>
      </div>

      {/* COMING SOON */}
      <div style={{
        position: "absolute", top: 1400, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        opacity: comingSoonOpacity, transform: `translateY(${comingSoonY}px)`,
      }}>
        <span style={{
          fontSize: 90, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 12, textTransform: "uppercase",
          background: `linear-gradient(90deg, ${GOLD_DARK}, ${GOLD_LIGHT}, ${GOLD})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          transform: `scale(${0.8 + soonScale * 0.2})`, display: "inline-block",
        }}>COMING</span>
        <span style={{
          fontSize: 90, fontWeight: 700, fontFamily: "sans-serif", letterSpacing: 12, textTransform: "uppercase",
          color: OFF_WHITE, transform: `scale(${0.8 + soonScale * 0.2})`, display: "inline-block",
        }}>SOON</span>
      </div>

      {/* Instagram handle */}
      <div style={{
        position: "absolute", bottom: 140, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        opacity: handleOpacity, transform: `translateY(${handleY}px)`,
      }}>
        <div style={{ height: 1, width: 360, background: `linear-gradient(to right, transparent, ${GOLD}50, transparent)` }} />
        <span style={{ fontFamily: "sans-serif", fontSize: 32, fontWeight: 600, color: GOLD, letterSpacing: 2 }}>@mirhapret</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 20, color: `${OFF_WHITE}70`, letterSpacing: 3, textTransform: "uppercase", fontWeight: 300 }}>
          mirhapret.com
        </span>
        <div style={{ marginTop: 8, padding: "10px 40px", border: `1px solid ${GOLD}60`, borderRadius: 1 }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 18, letterSpacing: 5, color: `${GOLD}cc`, textTransform: "uppercase" }}>
            Follow for Launch
          </span>
        </div>
      </div>

      {/* Shimmer */}
      <Shimmer progress={shimmerProgress} />

      {/* Bottom line */}
      <div style={{ position: "absolute", bottom: 60, left: 60, right: 60, opacity: handleOpacity * 0.5 }}>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${GOLD}40, transparent)` }} />
      </div>

    </AbsoluteFill>
  );
};
