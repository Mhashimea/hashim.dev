import { AbsoluteFill, useCurrentFrame } from "remotion";

/* ============================================================
   Agent Workshop — hand-drawn cartoon / storybook illustration.
   A cozy, warm-lit studio: Hashim delegating tasks to friendly
   robot helpers, a sunny Dubai-skyline window, plants, coffee.
   Bright painted scene inside the dark site frame (leerob move).
   Animated with Remotion; pure SVG so it stays crisp.
   ============================================================ */

export const WORKSHOP = {
  width: 1200,
  height: 720,
  fps: 30,
  durationInFrames: 300,
};

const P = {
  ink: "#4a382b", // warm illustrated outline (never pure black)
  wall: "#f4e3c8",
  wallDeep: "#e6cfa6",
  floor: "#e3b989",
  floorDeep: "#d5a373",
  sky: "#bfe3e8",
  skyDeep: "#a6d6dd",
  sun: "#f6c453",
  cloud: "#fff7ea",
  skin: "#e7b28a",
  hair: "#3a2a22",
  shirt: "#3fb9a6",
  marigold: "#e8a33d",
  terra: "#e07d5a",
  blue: "#7fb7c9",
  leaf: "#6fae7f",
  leafDeep: "#4f8f63",
  cream: "#fff7ea",
};

export const AgentWorkshop = () => {
  const frame = useCurrentFrame();
  const t = frame / WORKSHOP.fps;

  const breathe = 1 + 0.012 * Math.sin(t * 1.6);

  return (
    <AbsoluteFill style={{ backgroundColor: P.wall }}>
      <svg viewBox={`0 0 1200 720`} width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.wall} />
            <stop offset="100%" stopColor={P.wallDeep} />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.floor} />
            <stop offset="100%" stopColor={P.floorDeep} />
          </linearGradient>
          <radialGradient id="skyG" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#d7f0f2" />
            <stop offset="100%" stopColor={P.skyDeep} />
          </radialGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.sun} stopOpacity="0.9" />
            <stop offset="100%" stopColor={P.sun} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="warmth" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff2d6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff2d6" stopOpacity="0" />
          </radialGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* room */}
        <rect x="0" y="0" width="1200" height="540" fill="url(#wall)" />
        <rect x="0" y="512" width="1200" height="208" fill="url(#floor)" />
        <ellipse cx="600" cy="360" rx="620" ry="360" fill="url(#warmth)" />

        {/* ---- sunny window with Dubai skyline ---- */}
        <Window t={t} />

        {/* wall shelf with little tokens */}
        <g stroke={P.ink} strokeWidth="4" strokeLinecap="round">
          <line x1="150" y1="360" x2="330" y2="360" />
        </g>
        <Book x={168} y={318} c={P.terra} />
        <Book x={196} y={322} c={P.blue} />
        <Book x={224} y={316} c={P.marigold} />
        <PottedLeaf x={286} y={300} t={t} small />

        {/* ---- big plant, left ---- */}
        <Monstera x={92} y={430} t={t} />

        {/* ---- desk + character + laptop ---- */}
        <Shadow cx={600} cy={588} rx={220} ry={26} />
        <Character t={t} breathe={breathe} />
        <Desk />
        <Laptop t={t} />
        <Mug x={715} y={470} t={t} />

        {/* ---- robot helpers ---- */}
        <Robot x={250} y={520} color={P.blue} seed={0.2} t={t} holding />
        <Robot x={942} y={512} color={P.marigold} seed={1.9} t={t} />
        <FlyingBot x={968} y={228} t={t} />

        {/* delegated task parcels flying out from the laptop to robots */}
        <Parcel from={[590, 452]} to={[262, 486]} t={t} phase={0} />
        <Parcel from={[610, 452]} to={[938, 470]} t={t} phase={0.5} />

        {/* activity sparkles + a tiny "typing" bubble */}
        <Sparkle x={360} y={210} t={t} s={0} />
        <Sparkle x={880} y={330} t={t} s={1.3} />
        <Sparkle x={470} y={150} t={t} s={2.1} />
        <TypingBubble x={300} y={430} t={t} />

        {/* front plant, right */}
        <Monstera x={1082} y={470} t={t} flip />

        {/* gouache grain overlay */}
        <rect x="0" y="0" width="1200" height="720" filter="url(#grain)" opacity="0.05" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- Window + sky + skyline + sun ---------------- */
function Window({ t }: { t: number }) {
  const cx = 340;
  const cy = 240;
  const r = 150;
  const cloud1 = ((t * 10) % 360) - 60;
  const cloud2 = ((t * 7 + 120) % 360) - 60;
  return (
    <g>
      {/* frame ring */}
      <circle cx={cx} cy={cy} r={r + 12} fill={P.cream} stroke={P.ink} strokeWidth="5" />
      <clipPath id="win">
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath="url(#win)">
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="url(#skyG)" />
        {/* sun */}
        <circle cx={cx - 60} cy={cy - 60} r="70" fill="url(#sunGlow)" />
        <g transform={`rotate(${t * 8} ${cx - 60} ${cy - 60})`}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={cx - 60 + Math.cos(a) * 40}
                y1={cy - 60 + Math.sin(a) * 40}
                x2={cx - 60 + Math.cos(a) * 52}
                y2={cy - 60 + Math.sin(a) * 52}
                stroke={P.sun}
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <circle cx={cx - 60} cy={cy - 60} r="26" fill={P.sun} stroke={P.ink} strokeWidth="3" />
        {/* clouds */}
        <Cloud x={cx + cloud1} y={cy - 30} />
        <Cloud x={cx + cloud2} y={cy + 20} small />
        {/* Dubai skyline silhouette */}
        <g fill={P.terra} opacity="0.85">
          <rect x={cx - 130} y={cy + 70} width="22" height="60" rx="3" />
          <rect x={cx - 100} y={cy + 50} width="18" height="80" rx="3" />
          {/* Burj Khalifa spire */}
          <path d={`M ${cx - 60} ${cy + 130} L ${cx - 52} ${cy + 20} L ${cx - 44} ${cy + 4} L ${cx - 36} ${cy + 20} L ${cx - 28} ${cy + 130} Z`} />
          <rect x={cx - 6} y={cy + 60} width="20" height="70" rx="3" />
          <rect x={cx + 22} y={cy + 40} width="16" height="90" rx="3" />
          <rect x={cx + 48} y={cy + 74} width="24" height="56" rx="3" />
          <rect x={cx + 84} y={cy + 58} width="16" height="72" rx="3" />
        </g>
      </g>
      {/* cross bars */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={P.cream} strokeWidth="5" opacity="0.8" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={P.cream} strokeWidth="5" opacity="0.8" />
    </g>
  );
}

function Cloud({ x, y, small }: { x: number; y: number; small?: boolean }) {
  const s = small ? 0.7 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={P.cloud}>
      <ellipse cx="0" cy="0" rx="34" ry="20" />
      <ellipse cx="26" cy="6" rx="24" ry="16" />
      <ellipse cx="-26" cy="6" rx="24" ry="16" />
    </g>
  );
}

/* ---------------- Character (Hashim) ---------------- */
function Character({ t, breathe }: { t: number; breathe: number }) {
  const blink = (t % 3.4) > 3.2 ? 0.12 : 1;
  const tapL = Math.max(0, Math.sin(t * 9)) * 4;
  const tapR = Math.max(0, Math.sin(t * 9 + 1.2)) * 4;
  return (
    <g transform={`translate(600 470) scale(${breathe})`} style={{ transformOrigin: "600px 470px" }}>
      {/* forearms to laptop */}
      <path d="M -46 -6 Q -70 40 -30 62" fill="none" stroke={P.shirt} strokeWidth="26" strokeLinecap="round" />
      <path d="M 46 -6 Q 70 40 30 62" fill="none" stroke={P.shirt} strokeWidth="26" strokeLinecap="round" />
      {/* torso */}
      <path d="M -58 -8 Q -60 -70 0 -74 Q 60 -70 58 -8 L 58 70 L -58 70 Z" fill={P.shirt} stroke={P.ink} strokeWidth="4" />
      {/* collar */}
      <path d="M -20 -66 Q 0 -48 20 -66" fill="none" stroke={P.ink} strokeWidth="4" />
      {/* hands tapping */}
      <ellipse cx={-30} cy={62 - tapL} rx="13" ry="9" fill={P.skin} stroke={P.ink} strokeWidth="3" />
      <ellipse cx={30} cy={62 - tapR} rx="13" ry="9" fill={P.skin} stroke={P.ink} strokeWidth="3" />

      {/* neck */}
      <rect x="-13" y="-96" width="26" height="30" rx="10" fill={P.skin} stroke={P.ink} strokeWidth="4" />
      {/* head */}
      <g>
        <circle cx="0" cy="-128" r="42" fill={P.skin} stroke={P.ink} strokeWidth="4" />
        {/* ears + headphones */}
        <path d="M -44 -134 Q -54 -170 0 -176 Q 54 -170 44 -134" fill="none" stroke={P.ink} strokeWidth="7" strokeLinecap="round" />
        <rect x="-56" y="-140" width="16" height="30" rx="7" fill={P.marigold} stroke={P.ink} strokeWidth="3.5" />
        <rect x="40" y="-140" width="16" height="30" rx="7" fill={P.marigold} stroke={P.ink} strokeWidth="3.5" />
        {/* hair */}
        <path d="M -42 -140 Q -30 -184 0 -184 Q 34 -184 42 -142 Q 20 -164 0 -162 Q -22 -164 -42 -140 Z" fill={P.hair} />
        {/* beard */}
        <path d="M -34 -120 Q -30 -86 0 -84 Q 30 -86 34 -120 Q 18 -104 0 -104 Q -18 -104 -34 -120 Z" fill={P.hair} opacity="0.92" />
        {/* eyes */}
        <g fill={P.ink}>
          <ellipse cx="-15" cy="-128" rx="4.5" ry={7 * blink} />
          <ellipse cx="15" cy="-128" rx="4.5" ry={7 * blink} />
        </g>
        {/* brows */}
        <path d="M -22 -140 q 7 -5 14 0" fill="none" stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M 8 -140 q 7 -5 14 0" fill="none" stroke={P.ink} strokeWidth="3" strokeLinecap="round" />
        {/* smile */}
        <path d="M -12 -110 q 12 12 24 0" fill="none" stroke={P.ink} strokeWidth="3.5" strokeLinecap="round" />
        {/* cheek blush */}
        <circle cx="-24" cy="-116" r="6" fill={P.terra} opacity="0.28" />
        <circle cx="24" cy="-116" r="6" fill={P.terra} opacity="0.28" />
      </g>
    </g>
  );
}

/* ---------------- Desk + laptop + mug ---------------- */
function Desk() {
  return (
    <g>
      <rect x="430" y="512" width="340" height="20" rx="8" fill={P.floorDeep} stroke={P.ink} strokeWidth="4" />
      <rect x="446" y="532" width="14" height="66" rx="4" fill={P.floorDeep} stroke={P.ink} strokeWidth="4" />
      <rect x="740" y="532" width="14" height="66" rx="4" fill={P.floorDeep} stroke={P.ink} strokeWidth="4" />
    </g>
  );
}

function Laptop({ t }: { t: number }) {
  const glow = 0.6 + 0.4 * Math.abs(Math.sin(t * 2));
  return (
    <g>
      <rect x="548" y="500" width="104" height="14" rx="5" fill={P.cream} stroke={P.ink} strokeWidth="4" />
      <g transform="translate(556 452)">
        <rect x="0" y="0" width="88" height="52" rx="6" fill={P.ink} />
        <rect x="6" y="6" width="76" height="40" rx="4" fill={P.shirt} opacity={glow} />
        <rect x="14" y="14" width="40" height="4" rx="2" fill={P.cream} opacity="0.9" />
        <rect x="14" y="24" width="52" height="4" rx="2" fill={P.marigold} />
        <rect x="14" y="34" width="30" height="4" rx="2" fill={P.cream} opacity="0.7" />
      </g>
    </g>
  );
}

function Mug({ x, y, t }: { x: number; y: number; t: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2].map((i) => {
        const p = (t * 0.6 + i * 0.33) % 1;
        return (
          <path
            key={i}
            d={`M ${-6 + i * 6} ${-6 - p * 34} q 8 -8 0 -16`}
            fill="none"
            stroke={P.cream}
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={(1 - p) * 0.7}
          />
        );
      })}
      <rect x="-14" y="0" width="28" height="24" rx="5" fill={P.terra} stroke={P.ink} strokeWidth="4" />
      <path d="M 14 6 q 12 2 0 14" fill="none" stroke={P.ink} strokeWidth="4" />
    </g>
  );
}

/* ---------------- Robots ---------------- */
function Robot({
  x,
  y,
  color,
  seed,
  t,
  holding,
}: {
  x: number;
  y: number;
  color: string;
  seed: number;
  t: number;
  holding?: boolean;
}) {
  const bob = Math.sin(t * 1.8 + seed) * 4;
  const blink = ((t + seed) % 3) > 2.8 ? 0.12 : 1;
  const ant = 0.6 + 0.4 * Math.sin(t * 3 + seed);
  return (
    <g>
      <Shadow cx={x} cy={y + 60} rx={44} ry={12} />
      <g transform={`translate(${x} ${y + bob})`}>
        {/* legs */}
        <rect x="-20" y="34" width="12" height="18" rx="5" fill={color} stroke={P.ink} strokeWidth="4" />
        <rect x="8" y="34" width="12" height="18" rx="5" fill={color} stroke={P.ink} strokeWidth="4" />
        {/* body */}
        <rect x="-34" y="-8" width="68" height="52" rx="20" fill={color} stroke={P.ink} strokeWidth="4" />
        <rect x="-22" y="4" width="44" height="26" rx="9" fill={P.cream} />
        {/* belly readout */}
        <rect x="-14" y="12" width="20" height="4" rx="2" fill={color} />
        <rect x="-14" y="20" width="12" height="4" rx="2" fill={P.ink} opacity="0.4" />
        {/* arms */}
        <path d="M -34 4 q -16 6 -14 24" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
        <path d="M 34 4 q 16 6 14 24" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
        {/* head */}
        <rect x="-26" y="-46" width="52" height="40" rx="14" fill={color} stroke={P.ink} strokeWidth="4" />
        <rect x="-18" y="-38" width="36" height="24" rx="9" fill={P.ink} />
        <g fill={P.cream}>
          <ellipse cx="-8" cy="-26" rx="4.5" ry={6 * blink} />
          <ellipse cx="8" cy="-26" rx="4.5" ry={6 * blink} />
        </g>
        <path d="M -6 -18 q 6 5 12 0" fill="none" stroke={P.cream} strokeWidth="2.5" strokeLinecap="round" />
        {/* antenna */}
        <line x1="0" y1="-46" x2="0" y2="-62" stroke={P.ink} strokeWidth="4" />
        <circle cx="0" cy="-66" r="6" fill={P.marigold} stroke={P.ink} strokeWidth="3" opacity={ant} />
        {/* held parcel */}
        {holding && (
          <g transform="translate(0 44)">
            <rect x="-16" y="-6" width="32" height="26" rx="5" fill={P.marigold} stroke={P.ink} strokeWidth="4" />
            <line x1="-16" y1="6" x2="16" y2="6" stroke={P.ink} strokeWidth="3" />
            <line x1="0" y1="-6" x2="0" y2="20" stroke={P.ink} strokeWidth="3" />
          </g>
        )}
      </g>
    </g>
  );
}

function FlyingBot({ x, y, t }: { x: number; y: number; t: number }) {
  const fly = Math.sin(t * 1.4) * 10;
  const spin = t * 720;
  const blink = (t % 2.6) > 2.4 ? 0.15 : 1;
  return (
    <g transform={`translate(${x} ${y + fly})`}>
      <Shadow cx={0} cy={140 - fly} rx={26} ry={8} />
      {/* propellers */}
      <g transform={`rotate(${spin})`} stroke={P.ink} strokeWidth="3">
        <line x1="-30" y1="-18" x2="30" y2="-18" />
      </g>
      <line x1="-26" y1="-18" x2="-26" y2="-6" stroke={P.ink} strokeWidth="3" />
      <line x1="26" y1="-18" x2="26" y2="-6" stroke={P.ink} strokeWidth="3" />
      {/* body */}
      <rect x="-28" y="-6" width="56" height="40" rx="16" fill={P.terra} stroke={P.ink} strokeWidth="4" />
      <rect x="-20" y="2" width="40" height="24" rx="9" fill={P.ink} />
      <g fill={P.cream}>
        <ellipse cx="-9" cy="14" rx="4.5" ry={6 * blink} />
        <ellipse cx="9" cy="14" rx="4.5" ry={6 * blink} />
      </g>
      <path d="M -7 22 q 7 5 14 0" fill="none" stroke={P.cream} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* ---------------- Task parcel flying out ---------------- */
function Parcel({
  from,
  to,
  t,
  phase,
}: {
  from: [number, number];
  to: [number, number];
  t: number;
  phase: number;
}) {
  const prog = (t * 0.35 + phase) % 1;
  const ease = prog;
  const x = from[0] + (to[0] - from[0]) * ease;
  const arc = Math.sin(ease * Math.PI) * 70;
  const y = from[1] + (to[1] - from[1]) * ease - arc;
  const appear = Math.sin(prog * Math.PI); // fade in/out at ends
  return (
    <g transform={`translate(${x} ${y}) rotate(${ease * 40})`} opacity={appear}>
      <rect x="-13" y="-11" width="26" height="22" rx="5" fill={P.marigold} stroke={P.ink} strokeWidth="3.5" />
      <line x1="-13" y1="0" x2="13" y2="0" stroke={P.ink} strokeWidth="2.5" />
      <line x1="0" y1="-11" x2="0" y2="11" stroke={P.ink} strokeWidth="2.5" />
    </g>
  );
}

/* ---------------- Props: plants, books, sparkles, bubble ---------------- */
function Monstera({ x, y, t, flip, }: { x: number; y: number; t: number; flip?: boolean }) {
  const sway = Math.sin(t * 1.2) * 2.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      {/* pot */}
      <path d="M -34 60 L -28 118 Q -28 128 -18 128 L 18 128 Q 28 128 28 118 L 34 60 Z" fill={P.terra} stroke={P.ink} strokeWidth="4" />
      <rect x="-40" y="48" width="80" height="16" rx="6" fill={P.marigold} stroke={P.ink} strokeWidth="4" />
      <g transform={`rotate(${sway})`} style={{ transformOrigin: "0px 60px" }}>
        {[-42, -12, 20, 46].map((a, i) => (
          <g key={i} transform={`rotate(${a}) translate(0 -6)`}>
            <path d="M 0 60 Q -20 6 0 -46 Q 20 6 0 60 Z" fill={i % 2 ? P.leafDeep : P.leaf} stroke={P.ink} strokeWidth="4" />
            <line x1="0" y1="56" x2="0" y2="-40" stroke={P.ink} strokeWidth="2.5" opacity="0.5" />
          </g>
        ))}
      </g>
    </g>
  );
}

function PottedLeaf({ x, y, t, small }: { x: number; y: number; t: number; small?: boolean }) {
  const s = small ? 0.7 : 1;
  const sway = Math.sin(t * 1.5) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -16 30 L -12 60 Q -12 66 -6 66 L 6 66 Q 12 66 12 60 L 16 30 Z" fill={P.blue} stroke={P.ink} strokeWidth="3.5" />
      <g transform={`rotate(${sway})`} style={{ transformOrigin: "0px 30px" }}>
        <path d="M 0 30 Q -18 0 -6 -26" fill="none" stroke={P.leafDeep} strokeWidth="5" strokeLinecap="round" />
        <path d="M 0 30 Q 16 2 8 -22" fill="none" stroke={P.leaf} strokeWidth="5" strokeLinecap="round" />
        <path d="M 0 30 Q 0 -6 0 -30" fill="none" stroke={P.leaf} strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Book({ x, y, c }: { x: number; y: number; c: string }) {
  return <rect x={x} y={y} width="12" height="42" rx="2" fill={c} stroke={P.ink} strokeWidth="3" />;
}

function Sparkle({ x, y, t, s }: { x: number; y: number; t: number; s: number }) {
  const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + s));
  const drift = Math.sin(t * 1.1 + s) * 6;
  return (
    <g transform={`translate(${x} ${y + drift}) scale(${tw})`} opacity={tw}>
      <path d="M 0 -12 Q 2 -2 12 0 Q 2 2 0 12 Q -2 2 -12 0 Q -2 -2 0 -12 Z" fill={P.marigold} />
    </g>
  );
}

function TypingBubble({ x, y, t }: { x: number; y: number; t: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-26" y="-16" width="52" height="30" rx="12" fill={P.cream} stroke={P.ink} strokeWidth="3.5" />
      <path d="M -8 12 l 0 12 l 12 -12 Z" fill={P.cream} stroke={P.ink} strokeWidth="3.5" />
      {[0, 1, 2].map((i) => {
        const up = Math.max(0, Math.sin(t * 6 - i * 0.7)) * 3;
        return <circle key={i} cx={-12 + i * 12} cy={-1 - up} r="3.5" fill={P.terra} />;
      })}
    </g>
  );
}

/* ---------------- soft ground shadow ---------------- */
function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={P.ink} opacity="0.12" filter="url(#soft)" />;
}
