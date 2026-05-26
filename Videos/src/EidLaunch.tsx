import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Brand tokens ──────────────────────────────────────────────
const GOLD = "#c8a96e";
const GOLD_DARK = "#a8894e";
const GOLD_LIGHT = "#e8c98e";
const OFF_WHITE = "#f5f4f0";

// ── Laptop SVG geometry ───────────────────────────────────────
const LW = 1000;
const LH = 630;
const SX = 82;   // screen x
const SY = 68;   // screen y
const SW = 836;  // screen width
const SH = 442;  // screen height
const RY = 268;  // ribbon y (mid-lid)
const R_L = 22;  // ribbon left edge x
const R_R = 978; // ribbon right edge x
const R_MID = 500;
const R_LEN = R_R - R_L; // 956
const R_H = 24;  // ribbon height

// ── Scene timing ─────────────────────────────────────────────
const T_LAPTOP = 8;
const T_RIBBON = 60;
const T_RIBBON_END = 135;
const T_SCISSORS = 140;
const T_CUT = 205;
const T_SCREEN = 210;
const T_SCREEN_END = 275;
const T_TITLE = 255;
const T_PROMO = 320;
const T_HANDLE = 390;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── Ecommerce hero preview ────────────────────────────────────
const HeroPreview: React.FC = () => (
  <div style={{
    width: "100%", height: "100%",
    background: "#0e0e0e",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Georgia, serif",
  }}>
    {/* Announcement bar */}
    <div style={{ background: "#c8a96e", textAlign: "center", padding: "3px 0" }}>
      <span style={{ color: "#111", fontSize: 8, fontFamily: "sans-serif", letterSpacing: 3, fontWeight: 600 }}>
        EID SPECIAL — USE CODE MyEidi10 FOR 10% OFF
      </span>
    </div>
    {/* Nav */}
    <div style={{
      height: 30, background: "#111111", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", borderBottom: "1px solid #222"
    }}>
      <span style={{ color: GOLD, fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif" }}>MirhaPret</span>
      <div style={{ display: "flex", gap: 14 }}>
        {["Home", "Products", "About", "Contact"].map(l => (
          <span key={l} style={{ color: "#888", fontSize: 8, fontFamily: "sans-serif" }}>{l}</span>
        ))}
      </div>
    </div>
    {/* Hero */}
    <div style={{
      flex: 1, display: "flex",
      background: "linear-gradient(135deg, #0e0e0e 55%, #1a1208 100%)",
      padding: "16px 22px 16px 28px",
      gap: 16,
    }}>
      {/* Left: text */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
        <span style={{
          background: `${GOLD}22`, border: `1px solid ${GOLD}50`,
          color: GOLD, fontSize: 7, fontFamily: "sans-serif",
          padding: "2px 8px", borderRadius: 20, width: "fit-content",
          letterSpacing: 2, fontWeight: 600
        }}>EID COLLECTION 2026</span>
        <div>
          <div style={{ fontSize: 26, fontWeight: 400, color: "#fff", lineHeight: 1.15 }}>Dress to</div>
          <div style={{ fontSize: 26, fontWeight: 400, color: GOLD, lineHeight: 1.15 }}>Impress</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 5, fontFamily: "sans-serif", fontWeight: 300 }}>
            Where Lahore Meets Luxury
          </div>
        </div>
        <div style={{
          marginTop: 6, width: 110, padding: "7px 0",
          background: GOLD, color: "#111",
          fontSize: 8, fontFamily: "sans-serif", fontWeight: 700,
          letterSpacing: 2, textAlign: "center", borderRadius: 2
        }}>SHOP NOW →</div>
      </div>
      {/* Right: decorative blob */}
      <div style={{ width: 190, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{
          width: 150, height: 195,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background: "linear-gradient(160deg, #c8a96e18, #c8a96e35)",
          border: `1px solid ${GOLD}28`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: 52, opacity: 0.35 }}>✿</span>
        </div>
        <div style={{
          position: "absolute", bottom: 22, right: 6,
          background: GOLD, borderRadius: 6, padding: "5px 9px"
        }}>
          <div style={{ fontSize: 7, color: "#111", fontFamily: "sans-serif", fontWeight: 700 }}>Eid Special</div>
          <div style={{ fontSize: 13, color: "#111", fontWeight: 800, fontFamily: "sans-serif" }}>10% OFF</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Scissors (SVG, renders inside parent <svg>) ───────────────
const ScissorsSVG: React.FC<{ x: number; snip: number }> = ({ x, snip }) => (
  <g transform={`translate(${x}, ${RY})`}>
    {/* Pivot screw */}
    <circle cx={0} cy={0} r={7} fill="#9a9a9a" />
    <circle cx={0} cy={0} r={3.5} fill="#666" />
    <circle cx={-1} cy={-1} r={1} fill="rgba(255,255,255,0.3)" />

    {/* Top blade + handle */}
    <g transform={`rotate(${-snip}, 0, 0)`}>
      <ellipse cx={-52} cy={-26} rx={20} ry={15}
               fill="none" stroke="#b0b0b0" strokeWidth={3.5} />
      <line x1={-37} y1={-16} x2={0} y2={0}
            stroke="#aaa" strokeWidth={6} strokeLinecap="round" />
      <path d={`M 0,0 L 110,-10`}
            stroke="#d0d0d0" strokeWidth={6} strokeLinecap="round" />
      <path d={`M 2,-1 L 110,-9`}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeLinecap="round" />
    </g>

    {/* Bottom blade + handle */}
    <g transform={`rotate(${snip}, 0, 0)`}>
      <ellipse cx={-52} cy={26} rx={20} ry={15}
               fill="none" stroke="#b0b0b0" strokeWidth={3.5} />
      <line x1={-37} y1={16} x2={0} y2={0}
            stroke="#aaa" strokeWidth={6} strokeLinecap="round" />
      <path d={`M 0,0 L 110,10`}
            stroke="#d0d0d0" strokeWidth={6} strokeLinecap="round" />
      <path d={`M 2,1 L 110,9`}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  </g>
);

// ── Gold bow ──────────────────────────────────────────────────
const Bow: React.FC<{ cx: number; cy: number; opacity: number }> = ({ cx, cy, opacity }) => (
  <g opacity={opacity}>
    {/* Left loop */}
    <path
      d={`M ${cx},${cy} C ${cx-72},${cy-58} ${cx-105},${cy-48} ${cx-62},${cy-22} C ${cx-38},${cy-9} ${cx-16},${cy-3} ${cx},${cy} Z`}
      fill={GOLD} opacity={0.95}
    />
    {/* Right loop */}
    <path
      d={`M ${cx},${cy} C ${cx+72},${cy-58} ${cx+105},${cy-48} ${cx+62},${cy-22} C ${cx+38},${cy-9} ${cx+16},${cy-3} ${cx},${cy} Z`}
      fill={GOLD} opacity={0.95}
    />
    {/* Left tail */}
    <path d={`M ${cx-7},${cy+6} L ${cx-32},${cy+42} L ${cx-44},${cy+58}`}
          stroke={GOLD} strokeWidth={15} strokeLinecap="round" fill="none" />
    {/* Right tail */}
    <path d={`M ${cx+7},${cy+6} L ${cx+32},${cy+42} L ${cx+44},${cy+58}`}
          stroke={GOLD} strokeWidth={15} strokeLinecap="round" fill="none" />
    {/* Knot */}
    <ellipse cx={cx} cy={cy} rx={19} ry={15} fill={GOLD_DARK} />
    <ellipse cx={cx-2} cy={cy-2} rx={6} ry={5} fill={`${GOLD_LIGHT}60`} />
  </g>
);

// ── Main composition ──────────────────────────────────────────
export const EidLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Laptop appears
  const laptopSpring = spring({ frame: frame - T_LAPTOP, fps, config: { damping: 16, stiffness: 75 } });
  const laptopScale = interpolate(laptopSpring, [0, 1], [0.6, 1]);
  const laptopOpacity = interpolate(frame, [T_LAPTOP, T_LAPTOP + 22], [0, 1], clamp);

  // Ribbon draws left → right
  const ribbonDrawn = interpolate(frame, [T_RIBBON, T_RIBBON_END], [0, R_LEN], { ...clamp, easing: easeOut });
  const bowOpacity = !frame || frame < T_CUT
    ? interpolate(frame, [T_RIBBON_END - 15, T_RIBBON_END + 10], [0, 1], clamp)
    : 0;

  // Scissors travel from left to cut point
  const scissorsX = interpolate(frame, [T_SCISSORS, T_CUT - 5], [R_L + 20, R_MID - 50], { ...clamp, easing: easeOut });
  const snipAngle = Math.abs(Math.sin((frame - T_SCISSORS) * 0.45)) * 22 + 3;
  const scissorsVisible = frame >= T_SCISSORS && frame < T_CUT + 8;

  // Cut event
  const hasCut = frame >= T_CUT;
  const fallProgress = interpolate(frame, [T_CUT, T_CUT + 28], [0, 1], { ...clamp, easing: easeOut });
  const leftFallY = fallProgress * 95;
  const leftFallRot = fallProgress * -14;
  const leftFallX = fallProgress * -30;
  const rightFallY = fallProgress * 95;
  const rightFallRot = fallProgress * 14;
  const rightFallX = fallProgress * 30;
  const ribbonOpacity = Math.max(0, 1 - fallProgress * 1.3);

  // Cut flash
  const flashOpacity = interpolate(frame, [T_CUT, T_CUT + 3, T_CUT + 10], [0, 0.7, 0], clamp);

  // Screen reveal (clip from top → bottom)
  const screenReveal = interpolate(frame, [T_SCREEN, T_SCREEN_END], [0, 1], { ...clamp, easing: easeOut });

  // Title
  const titleOpacity = interpolate(frame, [T_TITLE, T_TITLE + 35], [0, 1], clamp);
  const titleY = interpolate(frame, [T_TITLE, T_TITLE + 40], [-28, 0], { ...clamp, easing: easeOut });

  // Promo badge
  const promoSpring = spring({ frame: frame - T_PROMO, fps, config: { damping: 13, stiffness: 95 } });
  const promoScale = interpolate(promoSpring, [0, 1], [0.5, 1]);
  const promoOpacity = interpolate(frame, [T_PROMO, T_PROMO + 22], [0, 1], clamp);

  // Handle
  const handleOpacity = interpolate(frame, [T_HANDLE, T_HANDLE + 28], [0, 1], clamp);
  const handleY = interpolate(frame, [T_HANDLE, T_HANDLE + 32], [18, 0], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill style={{ background: "#0a0705", overflow: "hidden" }}>

      {/* ── Desk background ───────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 1000px 700px at 50% 80%, #221508 0%, #0a0705 70%),
          radial-gradient(ellipse 600px 400px at 50% 95%, #2e1c0a 0%, transparent 60%)
        `,
      }} />
      {/* Warm lamp glow top right */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 700px 500px at 75% 8%, rgba(255,200,100,0.05) 0%, transparent 65%)",
      }} />
      {/* Desk surface horizon line */}
      <div style={{
        position: "absolute", top: 1230, left: 0, right: 0, height: 1,
        background: "linear-gradient(to right, transparent, rgba(200,150,60,0.12), transparent)",
      }} />
      {/* Desk texture gradient */}
      <div style={{
        position: "absolute", top: 1230, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(to bottom, #1a1005, #0d0804)",
      }} />

      {/* ── Title text ────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 110, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <span style={{
          fontFamily: "sans-serif", fontSize: 13, letterSpacing: 6,
          color: `${GOLD}88`, textTransform: "uppercase", fontWeight: 300
        }}>MirhaPret Presents</span>

        <div style={{
          fontFamily: "Georgia, serif", fontSize: 58, fontWeight: 400,
          color: OFF_WHITE, textAlign: "center", lineHeight: 1.2,
        }}>
          Launching Our Store
        </div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 68, fontWeight: 400,
          textAlign: "center", lineHeight: 1.1,
          background: `linear-gradient(100deg, ${GOLD_DARK} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          This Eid ✦
        </div>

        {/* Ornamental divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
          <div style={{ height: 1, width: 90, background: `linear-gradient(to left, ${GOLD}, transparent)`, opacity: 0.55 }} />
          <div style={{ width: 7, height: 7, background: GOLD, transform: "rotate(45deg)", opacity: 0.8 }} />
          <div style={{ width: 10, height: 10, border: `1.5px solid ${GOLD}`, transform: "rotate(45deg)", opacity: 0.5 }} />
          <div style={{ width: 7, height: 7, background: GOLD, transform: "rotate(45deg)", opacity: 0.8 }} />
          <div style={{ height: 1, width: 90, background: `linear-gradient(to right, ${GOLD}, transparent)`, opacity: 0.55 }} />
        </div>
      </div>

      {/* ── Laptop ────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 400,
        left: 40,
        right: 40,
        opacity: laptopOpacity,
        transform: `scale(${laptopScale}) perspective(2200px) rotateX(4deg)`,
        transformOrigin: "center 300px",
      }}>
        <svg
          viewBox={`0 0 ${LW} ${LH}`}
          width="1000"
          height="630"
          style={{ display: "block", margin: "0 auto" }}
        >
          <defs>
            {/* Screen reveal clip (grows top → bottom) */}
            <clipPath id="sc">
              <rect x={0} y={0} width={SW} height={SH * screenReveal} />
            </clipPath>
            {/* Laptop lid gradient */}
            <linearGradient id="lidG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3e3e3e" />
              <stop offset="100%" stopColor="#222" />
            </linearGradient>
            {/* Base gradient */}
            <linearGradient id="baseG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#383838" />
              <stop offset="100%" stopColor="#1e1e1e" />
            </linearGradient>
            {/* Screen glow */}
            <radialGradient id="sg" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor={`${GOLD}12`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Shadow */}
            <filter id="sh" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="24" stdDeviation="28" floodColor="rgba(0,0,0,0.75)" />
            </filter>
          </defs>

          {/* Ground shadow */}
          <ellipse cx={LW / 2} cy={LH - 8} rx={400} ry={18} fill="rgba(0,0,0,0.55)" />

          {/* ── Base ── */}
          <path d={`M 0,${LH-78} L ${LW},${LH-78} L ${LW-32},${LH-32} L 32,${LH-32} Z`}
                fill="url(#baseG)" />
          {/* Keyboard deck */}
          <rect x={70} y={LH-76} width={LW-140} height={40} rx={4} fill="#2c2c2c" />
          {/* Trackpad */}
          <rect x={LW/2-85} y={LH-70} width={170} height={34} rx={7}
                fill="#313131" stroke="#404040" strokeWidth={1} />
          {/* Hinge bar */}
          <rect x={LW/2-120} y={LH-82} width={240} height={6} rx={3} fill="#444" />
          {/* Base top edge */}
          <rect x={0} y={LH-80} width={LW} height={3} fill="#404040" />

          {/* ── Lid ── */}
          <rect x={18} y={12} width={LW-36} height={LH-95} rx={15}
                fill="url(#lidG)" filter="url(#sh)" />
          {/* Lid edges */}
          <rect x={18} y={12} width={LW-36} height={7} rx={15} fill="#555" opacity={0.65} />
          <rect x={18} y={12} width={8} height={LH-95} rx={15} fill="#484848" opacity={0.5} />
          <rect x={LW-26} y={12} width={8} height={LH-95} rx={15} fill="#1e1e1e" opacity={0.6} />

          {/* ── Screen bezel ── */}
          <rect x={46} y={42} width={LW-92} height={LH-142} rx={9} fill="#0c0c0c" />

          {/* ── Screen area ── */}
          <rect x={SX} y={SY} width={SW} height={SH} rx={4} fill="#0e0e0e" />

          {/* Screen glow (when on) */}
          {screenReveal > 0.05 && (
            <rect x={SX} y={SY} width={SW} height={SH} fill="url(#sg)" opacity={screenReveal} />
          )}

          {/* ── Ecommerce hero preview ── */}
          <foreignObject x={SX} y={SY} width={SW} height={SH} clipPath="url(#sc)">
            <div style={{ width: "100%", height: "100%" }}>
              <HeroPreview />
            </div>
          </foreignObject>

          {/* Screen dark overlay (before reveal) */}
          {screenReveal < 0.98 && (
            <rect x={SX} y={SY} width={SW} height={SH} rx={4}
                  fill={`rgba(8,6,4,${Math.max(0, 1 - screenReveal * 1.2)})`} />
          )}

          {/* Camera */}
          <circle cx={LW/2} cy={28} r={5.5} fill="#1e1e1e" />
          <circle cx={LW/2} cy={28} r={2.5} fill="#2a2a2a" />
          <circle cx={LW/2 - 1} cy={27} r={0.9} fill="rgba(255,255,255,0.12)" />

          {/* ── RIBBON ── */}
          {!hasCut && ribbonDrawn > 0 && (
            <>
              {/* Left half (R_L → R_MID) */}
              <rect
                x={R_L}
                y={RY - R_H / 2}
                width={Math.min(ribbonDrawn, R_MID - R_L)}
                height={R_H}
                fill={GOLD}
                opacity={0.93}
              />
              {/* Ribbon edge shine */}
              <rect
                x={R_L}
                y={RY - R_H / 2}
                width={Math.min(ribbonDrawn, R_MID - R_L)}
                height={4}
                fill={GOLD_LIGHT}
                opacity={0.45}
              />
              {/* Right half (R_MID → R_R) */}
              {ribbonDrawn > R_MID - R_L && (
                <>
                  <rect
                    x={R_MID}
                    y={RY - R_H / 2}
                    width={ribbonDrawn - (R_MID - R_L)}
                    height={R_H}
                    fill={GOLD}
                    opacity={0.93}
                  />
                  <rect
                    x={R_MID}
                    y={RY - R_H / 2}
                    width={ribbonDrawn - (R_MID - R_L)}
                    height={4}
                    fill={GOLD_LIGHT}
                    opacity={0.45}
                  />
                </>
              )}
            </>
          )}

          {/* ── BOW ── */}
          {!hasCut && <Bow cx={R_MID} cy={RY} opacity={bowOpacity} />}

          {/* ── RIBBON AFTER CUT (falling halves) ── */}
          {hasCut && (
            <>
              {/* Left half falls */}
              <g transform={`translate(${leftFallX}, ${leftFallY}) rotate(${leftFallRot}, ${(R_L + R_MID) / 2}, ${RY})`}
                 opacity={ribbonOpacity}>
                <rect x={R_L} y={RY - R_H / 2} width={R_MID - R_L} height={R_H} fill={GOLD} />
                <rect x={R_L} y={RY - R_H / 2} width={R_MID - R_L} height={4} fill={GOLD_LIGHT} opacity={0.45} />
              </g>
              {/* Right half falls */}
              <g transform={`translate(${rightFallX}, ${rightFallY}) rotate(${rightFallRot}, ${(R_MID + R_R) / 2}, ${RY})`}
                 opacity={ribbonOpacity}>
                <rect x={R_MID} y={RY - R_H / 2} width={R_R - R_MID} height={R_H} fill={GOLD} />
                <rect x={R_MID} y={RY - R_H / 2} width={R_R - R_MID} height={4} fill={GOLD_LIGHT} opacity={0.45} />
              </g>
            </>
          )}

          {/* ── SCISSORS ── */}
          {scissorsVisible && <ScissorsSVG x={scissorsX} snip={snipAngle} />}

          {/* ── Cut flash ── */}
          {flashOpacity > 0 && (
            <rect x={0} y={0} width={LW} height={LH} fill={`rgba(255,240,180,${flashOpacity})`} />
          )}
        </svg>

        {/* Laptop reflection on desk */}
        <div style={{
          marginTop: -8, height: 40, marginLeft: 60, marginRight: 60,
          background: "linear-gradient(to bottom, rgba(200,169,110,0.06), transparent)",
          filter: "blur(8px)",
          transform: "scaleY(-1)",
          opacity: 0.5,
        }} />
      </div>

      {/* ── Promo code badge ──────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 290,
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: promoOpacity,
        transform: `scale(${promoScale})`,
        transformOrigin: "center",
      }}>
        <div style={{
          background: "#140e05",
          border: `1.5px solid ${GOLD}55`,
          borderRadius: 14,
          padding: "24px 48px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          position: "relative", overflow: "hidden",
          boxShadow: `0 0 60px rgba(200,169,110,0.12)`,
        }}>
          {/* Corner brackets */}
          {[["top","left"], ["top","right"], ["bottom","left"], ["bottom","right"]].map(([v, h]) => (
            <div key={`${v}${h}`} style={{
              position: "absolute",
              [v]: 10, [h]: 10,
              width: 18, height: 18,
              borderTop: v === "top" ? `2px solid ${GOLD}70` : undefined,
              borderBottom: v === "bottom" ? `2px solid ${GOLD}70` : undefined,
              borderLeft: h === "left" ? `2px solid ${GOLD}70` : undefined,
              borderRight: h === "right" ? `2px solid ${GOLD}70` : undefined,
            }} />
          ))}

          <span style={{
            fontFamily: "sans-serif", fontSize: 13, letterSpacing: 5,
            color: `${GOLD}90`, textTransform: "uppercase", fontWeight: 300
          }}>Exclusive Eid Offer</span>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{
              fontFamily: "Georgia, serif", fontSize: 76, fontWeight: 400, lineHeight: 1,
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>10%</span>
            <span style={{
              fontFamily: "sans-serif", fontSize: 30, color: OFF_WHITE,
              fontWeight: 300, letterSpacing: 2
            }}>OFF</span>
          </div>

          {/* Promo code pill */}
          <div style={{
            background: "#0d0905",
            borderRadius: 8,
            padding: "12px 36px",
            border: `1.5px dashed ${GOLD}55`,
            marginTop: 4,
          }}>
            <span style={{
              fontFamily: "Consolas, monospace", fontSize: 32, fontWeight: 700,
              color: GOLD, letterSpacing: 5,
            }}>MyEidi10</span>
          </div>

          <span style={{
            fontFamily: "sans-serif", fontSize: 11, color: "#555",
            letterSpacing: 3, textTransform: "uppercase", marginTop: 2
          }}>Use at checkout · Limited time only</span>
        </div>
      </div>

      {/* ── Instagram handle ──────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 110,
        left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        opacity: handleOpacity,
        transform: `translateY(${handleY}px)`,
      }}>
        <div style={{
          height: 1, width: 320,
          background: `linear-gradient(to right, transparent, ${GOLD}45, transparent)`,
        }} />
        <span style={{
          fontFamily: "sans-serif", fontSize: 30, fontWeight: 600,
          color: GOLD, letterSpacing: 2,
        }}>@mirhapret</span>
        <div style={{
          height: 1, width: 320,
          background: `linear-gradient(to right, transparent, ${GOLD}45, transparent)`,
        }} />
      </div>

    </AbsoluteFill>
  );
};
