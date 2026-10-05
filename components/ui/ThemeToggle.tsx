'use client';

import { BlurIn } from '@/components/ui/motion-primitives';
import { useRef, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const STEPS = 14;
const PIECES = 22;
const DURATION = 600;
const SIZES = { s: 3, m: 7, l: 12 } as const;
const DIRS = { h: [1, 0], v: [0, 1], d: [0.7, 0.7] } as const;

type Rect = { x: number; y: number; w: number; h: number };

function splitRects(vw: number, vh: number, count: number): Rect[] {
  const rects: Rect[] = [{ x: 0, y: 0, w: vw, h: vh }];
  while (rects.length < count) {
    let idx = 0;
    if (Math.random() < 0.4) {
      idx = Math.floor(Math.random() * rects.length);
    } else {
      rects.forEach((r, i) => {
        if (r.w * r.h > rects[idx].w * rects[idx].h) idx = i;
      });
    }
    const [r] = rects.splice(idx, 1);
    const cutVertical = r.w > r.h ? Math.random() < 0.8 : Math.random() < 0.2;
    const thin = Math.random() < 0.35;
    const t = thin ? (Math.random() < 0.5 ? rand(0.05, 0.15) : rand(0.85, 0.95)) : rand(0.25, 0.75);

    if (cutVertical) {
      rects.push({ x: r.x, y: r.y, w: r.w * t, h: r.h }, { x: r.x + r.w * t, y: r.y, w: r.w * (1 - t), h: r.h });
    } else {
      rects.push({ x: r.x, y: r.y, w: r.w, h: r.h * t }, { x: r.x, y: r.y + r.h * t, w: r.w, h: r.h * (1 - t) });
    }
  }
  return rects;
}

function buildGlitch(vw: number, vh: number, ox: number, oy: number) {
  const rects = splitRects(vw, vh, PIECES);
  const spread = Math.max(vw, vh);

  const order = rects
    .map((r, i) => ({ i, d: Math.hypot(r.x + r.w / 2 - ox, r.y + r.h / 2 - oy) + rand(0, spread * 0.3) }))
    .sort((a, b) => a.d - b.d)
    .map((o) => o.i);

  const gaps = Array.from({ length: STEPS }, () => rand(0.4, 1.6));
  const total = gaps.reduce((a, b) => a + b, 0);
  let acc = 0;
  const offsets = [0, ...gaps.map((g) => (acc += g) / total)];

  const oldFrames: Keyframe[] = [];
  const newFrames: Keyframe[] = [];

  for (let k = 0; k <= STEPS; k++) {
    const p = k / STEPS;
    const calm = 1 - p;
    const count = k === STEPS ? PIECES : Math.round(Math.pow(p, 1.4) * PIECES);
    const shown = new Set(order.slice(0, count));
    const d = rects
      .filter((_, i) => shown.has(i))
      .map(
        (r) =>
          `M${r.x.toFixed(1)} ${r.y.toFixed(1)}h${(r.w + 0.5).toFixed(1)}v${(r.h + 0.5).toFixed(1)}h${(-(r.w + 0.5)).toFixed(1)}z`,
      )
      .join('');
    const clip = d ? `path("${d}")` : 'path("M0 0Z")';

    // horizontal only, diagonal, or vertical only; sometimes no shake at all
    const jolt = (amp: number) => {
      if (Math.random() < 0.3) return 'translate(0px, 0px)';
      const axis = Math.random();
      const dx = axis < 0.75 ? rand(-amp, amp) * calm : 0;
      const dy = axis > 0.45 ? rand(-amp * 0.6, amp * 0.6) * calm : 0;
      return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    };

    const size = calm > 0.66 ? 'l' : calm > 0.33 ? 'm' : 's';
    const split = () => (k === STEPS ? 'none' : `url(#glitch-rgb-${pick(['h', 'v', 'd'])}-${size})`);

    oldFrames.push({ offset: offsets[k], easing: 'steps(1, end)', transform: jolt(30), filter: split() });
    newFrames.push({
      offset: offsets[k],
      easing: 'steps(1, end)',
      transform: jolt(24),
      filter: split(),
      clipPath: clip,
    });
  }
  return { oldFrames, newFrames };
}

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const theme: Theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  const toggle = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('startViewTransition' in document) || reduce) {
      setTheme(next);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const ox = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const oy = rect ? rect.top + rect.height / 2 : 30;
    const root = document.documentElement;

    const vt = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    vt.ready
      .then(() => {
        const { oldFrames, newFrames } = buildGlitch(window.innerWidth, window.innerHeight, ox, oy);
        root.animate(oldFrames, { duration: DURATION, fill: 'forwards', pseudoElement: '::view-transition-old(root)' });
        root.animate(newFrames, { duration: DURATION, fill: 'forwards', pseudoElement: '::view-transition-new(root)' });
      })
      .catch(() => {});
  };

  if (!mounted)
    return (
      <div
        className="h-5 w-5"
        aria-hidden="true"
      />
    );

  return (
    <>
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: 'absolute' }}>
        {Object.entries(DIRS).flatMap(([dirId, [ux, uy]]) =>
          Object.entries(SIZES).map(([sizeId, s]) => (
            <filter
              key={`${dirId}-${sizeId}`}
              id={`glitch-rgb-${dirId}-${sizeId}`}
              colorInterpolationFilters="sRGB">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="r"
              />
              <feOffset
                in="r"
                dx={-s * ux}
                dy={-s * uy}
                result="ro"
              />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="g"
              />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="b"
              />
              <feOffset
                in="b"
                dx={s * ux}
                dy={s * uy}
                result="bo"
              />
              <feBlend
                in="ro"
                in2="g"
                mode="screen"
                result="rg"
              />
              <feBlend
                in="rg"
                in2="bo"
                mode="screen"
              />
            </filter>
          )),
        )}
      </svg>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        className="relative flex h-5 w-5 items-center justify-center transition-colors duration-200"
        style={{ color: 'var(--color-foreground-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-text)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-foreground-muted)')}>
        <span className="absolute inset-0 flex items-center justify-center">
          <BlurIn
            trigger="mount"
            delay={1.2}
            blur={8}
            y={0}
            duration={DURATION / 1000}
            className="flex items-center justify-center">
            {theme === 'dark' ? (
              <Moon
                size={16}
                strokeWidth={1.75}
              />
            ) : (
              <Sun
                size={16}
                strokeWidth={1.75}
              />
            )}
          </BlurIn>
        </span>
      </button>
    </>
  );
}
