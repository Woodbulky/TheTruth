'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, type TargetAndTransition, type Transition } from 'framer-motion';
import { VERDICT_META } from '@/components/verdict/VerdictChip';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';

export type LumiState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'reacting';

const C = {
  skin: '#B97A56', skinShade: '#A86B48', skinDeep: '#8E5A3C', hair: '#2B1B17', hairLine: '#4A332A',
  teal: '#00A884', mint: '#06D6A0', gold: '#FFD166', goldDeep: '#E0A800', ink: '#1E130F', lip: '#7A2E2A', set: '#334155',
};

// Every mouth shares one command shape (M Q Q Z) so Framer can morph between them.
const MOUTH: Record<Verdict | 'neutral', string> = {
  neutral: 'M91 113 Q100 120 109 113 Q100 116 91 113Z',
  VERIFIED: 'M88 111 Q100 125 112 111 Q100 115 88 111Z',
  FALSE: 'M92 117 Q100 112 108 117 Q100 115 92 117Z',
  OUTDATED: 'M96 115 Q100 120 104 115 Q100 111 96 115Z',
  PARTLY_SUPPORTED: 'M91 115 Q101 118 109 110 Q101 114 91 115Z',
};

/** SVG transform pivot in viewBox coordinates (Framer defaults to each element's own centre). */
const at = (x: number, y: number) => ({ transformBox: 'view-box' as const, originX: `${x}px`, originY: `${y}px` });
const loop = (duration: number, extra?: Transition): Transition => ({ duration, repeat: Infinity, ease: 'easeInOut', ...extra });

/**
 * Lumi, SATYA's original illustrated assistant. Layer ids follow CLAUDE.md so a commissioned
 * illustration can drop in later: shoulders · neck · hair-back · head · eyes · brows · mouth ·
 * hair-front · headset · spark · halo.
 */
export function Lumi({ state = 'idle', mood, volume = 0, size = 36, asking = false }: {
  state?: LumiState; mood?: Verdict; volume?: number; size?: number;
  /** "send me more" moment: raised brows + one nod (state stays idle). */
  asking?: boolean;
}) {
  const t = STR[useLang()];
  const still = useReducedMotion() ?? false;
  const clip = `lumi${useId().replace(/\W/g, '')}`;
  const tiny = size < 48;
  const react = state === 'reacting' ? mood : undefined;

  // Blink every 3–6s (kept even with reduced motion).
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const next = () => { id = setTimeout(() => { setBlink(true); id = setTimeout(() => { setBlink(false); next(); }, 130); }, 3000 + Math.random() * 3000); };
    next();
    return () => clearTimeout(id);
  }, []);

  // Smoothed volume (lerp 0.3/frame) drives mouth + halo while speaking or listening.
  const voiced = state === 'speaking' || state === 'listening';
  const target = useRef(0);
  useEffect(() => { target.current = voiced ? Math.min(1, Math.max(0, volume)) : 0; }, [voiced, volume]);
  const open = useMotionValue(0);
  useEffect(() => {
    if (!voiced) { open.set(0); return; }
    let raf = 0;
    const tick = () => { open.set(open.get() + (target.current - open.get()) * 0.3); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [voiced, open]);
  const talkMouth = useTransform(open, (o) => `M91 113 Q100 ${120 + o * 9} 109 113 Q100 ${116 - o * 4} 91 113Z`);
  const browLift = useTransform(open, (o) => -Math.max(0, o - 0.55) * 6);
  const haloScale = useTransform(open, [0, 1], [1, 1.06]);
  const haloGlow = useTransform(open, [0, 1], [0.55, 1]);

  const halo = react ? VERDICT_META[react].color : C.gold;

  // Head pose (applied to hair-back and head groups so they move together).
  const head: TargetAndTransition = still ? {}
    : react === 'FALSE' ? { rotate: 0, x: [0, -3, 3, -2, 2, 0], transition: { duration: 0.7 } }
    : react === 'PARTLY_SUPPORTED' ? { rotate: 6, x: 0 }
    : state === 'listening' ? { rotate: -6, x: 0 }
    : asking ? { rotate: 0, x: 0, y: [0, 3, 0, 2, 0], transition: { duration: 0.9 } }
    : { rotate: 0, x: 0, y: 0 };

  // Eye direction.
  const look: TargetAndTransition = still ? {}
    : state === 'thinking' ? { x: [-2.5, 2.5, -2.5], y: 0, transition: loop(2.2) }
    : state === 'listening' ? { x: 0, y: -1.5 }
    : react === 'OUTDATED' ? { x: 2.5, y: -1.5 }
    : { x: 0, y: 0 };

  const brows = react === 'FALSE' ? { l: -12, r: 12, y: 0 } : asking || react === 'OUTDATED' ? { l: 0, r: 0, y: -3 } : { l: 0, r: 0, y: 0 };
  const breathe = still ? {} : { y: [0, -2, 0], transition: loop(4) };

  return (
    <svg role="img" aria-label={t.lumiAria} viewBox="0 0 200 200" width={size} height={size} className="shrink-0 overflow-visible">
      <defs>
        <clipPath id={clip}><circle cx="100" cy="100" r="90" /></clipPath>
      </defs>

      <motion.g id="halo" style={{ ...at(100, 100), scale: state === 'listening' ? haloScale : 1, opacity: voiced ? haloGlow : 1 }}>
        <motion.circle
          cx="100" cy="100" r="95" fill="none"
          animate={{ stroke: halo, strokeWidth: react && !still ? [6, 11, 6] : 6 }}
          transition={{ duration: 0.6 }}
        />
      </motion.g>
      <circle cx="100" cy="100" r="90" fill="#E6F6F1" />

      <g clipPath={`url(#${clip})`}>
        <motion.g animate={breathe}>
          <motion.g id="hair-back" style={at(100, 130)} animate={head}>
            <path d="M58 96 C52 50 78 34 102 34 C130 34 150 54 144 100 C143 114 139 124 132 132 L122 118 L80 118 C68 120 60 110 58 96Z" fill={C.hair} />
          </motion.g>

          <g id="shoulders">
            <path d="M22 200 C24 168 52 152 84 147 L116 147 C148 152 176 168 178 200Z" fill={C.teal} />
            <path d="M84 147 L100 170 L116 147Z" fill={C.skinDeep} />
            <path d="M116 147 C134 150 150 156 160 166 L132 200 L112 200 C118 182 120 164 116 147Z" fill={C.mint} />
          </g>
          <g id="neck">
            <path d="M88 120 L112 120 L114 150 C108 158 92 158 86 150Z" fill={C.skinShade} />
            <path d="M88 128 C96 136 104 136 112 128 L112 122 L88 122Z" fill={C.skinDeep} opacity=".6" />
          </g>

          <motion.g style={at(100, 130)} animate={head}>
            <g id="head">
              <ellipse cx="66" cy="96" rx="7" ry="10" fill="#B07250" />
              <ellipse cx="134" cy="96" rx="7" ry="10" fill="#B07250" />
              <path d="M66 86 C66 60 82 48 100 48 C118 48 134 60 134 86 C134 112 120 130 100 130 C80 130 66 112 66 86Z" fill={C.skin} />
              <circle cx="80" cy="104" r="6" fill="#E07A6A" opacity={react === 'VERIFIED' ? 0.45 : 0.25} />
              <circle cx="120" cy="104" r="6" fill="#E07A6A" opacity={react === 'VERIFIED' ? 0.45 : 0.25} />
              {!tiny && <path d="M100 96 Q98 104 101 106" stroke={C.skinDeep} strokeWidth="1.8" fill="none" strokeLinecap="round" />}
              {!tiny && <><circle cx="134" cy="108" r="2.4" fill={C.gold} /><circle cx="66" cy="108" r="2.4" fill={C.gold} /></>}
            </g>

            <motion.g id="eyes" style={at(100, 92)} animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.07 }}>
              {react === 'VERIFIED' ? (
                <g stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round">
                  <path d="M80 94 Q86 86 92 94" /><path d="M108 94 Q114 86 120 94" />
                </g>
              ) : (
                <motion.g animate={look}>
                  <ellipse cx="86" cy="92" rx="5" ry="6" fill={C.ink} />
                  <ellipse cx="114" cy="92" rx="5" ry="6" fill={C.ink} />
                  <circle cx="87.6" cy="90" r="1.7" fill="#fff" />
                  <circle cx="115.6" cy="90" r="1.7" fill="#fff" />
                </motion.g>
              )}
            </motion.g>

            <motion.g id="brows" style={{ y: browLift }}>
              <motion.path d="M78 80 Q86 76 93 79" style={at(86, 79)} animate={{ rotate: brows.l, y: brows.y }}
                stroke={C.hair} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <motion.path d="M107 79 Q114 76 122 80" style={at(114, 79)} animate={{ rotate: brows.r, y: brows.y }}
                stroke={C.hair} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </motion.g>

            <g id="mouth" fill={C.lip} stroke={C.lip} strokeWidth="2" strokeLinejoin="round">
              {state === 'speaking'
                ? <motion.path d={talkMouth} />
                : <motion.path initial={false} animate={{ d: MOUTH[react ?? 'neutral'] }} transition={{ duration: 0.3 }} />}
            </g>

            <g id="hair-front">
              <path d="M64 92 C60 58 80 42 102 42 C126 42 142 58 136 92 C134 78 128 66 116 60 C104 70 86 74 70 76 C67 82 65 87 64 92Z" fill={C.hair} />
              {!tiny && <path d="M96 46 C108 54 116 58 122 60" stroke="#3E2A23" strokeWidth="2" fill="none" strokeLinecap="round" />}
              <motion.g style={at(128, 100)} animate={still ? {} : { rotate: [-2, 2, -2], transition: loop(5) }}>
                <g fill={C.hair}>
                  <path d="M130 100 C140 112 140 124 136 134 L126 134 C128 124 126 112 122 104Z" />
                  <ellipse cx="132" cy="140" rx="8" ry="9" />
                  <ellipse cx="134" cy="155" rx="7.5" ry="8.5" />
                  <ellipse cx="135" cy="169" rx="7" ry="8" />
                  <ellipse cx="135" cy="182" rx="6" ry="7" />
                  <path d="M131 188 L139 188 L141 198 L129 198Z" />
                </g>
                {!tiny && <path d="M126 136 Q132 142 138 136 M128 151 Q134 157 140 151 M129 165 Q135 171 141 165 M130 178 Q135 183 140 178" stroke={C.hairLine} strokeWidth="1.4" fill="none" />}
                <rect x="129" y="186" width="12" height="3" rx="1.5" fill={C.gold} />
              </motion.g>
            </g>

            <g id="headset" fill={C.set} stroke={C.set} strokeLinecap="round">
              <path d="M66 82 C66 52 88 38 104 38" strokeWidth="3.5" fill="none" />
              <rect x="58" y="86" width="12" height="20" rx="6" stroke="none" />
              {!tiny && <><path d="M64 104 C66 116 76 120 86 118" strokeWidth="2.5" fill="none" /><circle cx="87" cy="118" r="3" stroke="none" /></>}
            </g>

            <motion.path
              id="spark" d="M120 52 L123 59 L130 62 L123 65 L120 72 L117 65 L110 62 L117 59Z"
              fill={C.gold} stroke={C.goldDeep} strokeWidth="1" style={at(120, 62)}
              animate={still ? {} : state === 'thinking'
                ? { rotate: 360, scale: 1, transition: { duration: 1.6, repeat: Infinity, ease: 'linear' } }
                : { rotate: 0, scale: [1, 1.18, 1], transition: loop(2.4) }}
            />
          </motion.g>

          {state === 'thinking' && (
            <g fill={C.teal}>
              {[28, 40, 52].map((cx, i) => (
                <motion.circle key={cx} cx={cx} cy={66 - i * 6} r="4.5"
                  animate={still ? {} : { y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={loop(1.2, { delay: i * 0.18 })} />
              ))}
            </g>
          )}

          {react === 'OUTDATED' && (
            <motion.g style={at(160, 58)} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
              <circle cx="160" cy="58" r="11" fill="#fff" stroke={VERDICT_META.OUTDATED.color} strokeWidth="3" />
              <path d="M160 51 V58 L165 61" stroke={VERDICT_META.OUTDATED.color} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </motion.g>
          )}
        </motion.g>
      </g>
    </svg>
  );
}
