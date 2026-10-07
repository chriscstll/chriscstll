'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const DELAY_SCALE = 0.35;
export const MAX_DELAY = 0.8;
export const STAGGER_SCALE = 0.6;
export const scaleDelay = (d = 0) => Math.min(d * DELAY_SCALE, MAX_DELAY);

const motionTags = {
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  div: motion.div,
} as const;

type MotionTag = keyof typeof motionTags;

type CascadeTextProps = {
  text: string;
  as?: MotionTag;
  className?: string;

  charClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  splitBy?: 'char' | 'word';
  blur?: number;
  y?: number;
  trigger?: 'mount' | 'view';
};

export function CascadeText({
  text,
  as = 'span',
  className = '',
  charClassName = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.45,
  trigger = 'view',
  blur = 8,
  y = -10,
}: CascadeTextProps) {
  const reduce = useReducedMotion();
  const Tag = motionTags[as];

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(' ');

  return (
    <Tag
      className={className}
      aria-label={text}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger * STAGGER_SCALE,
            delayChildren: scaleDelay(delay),
          },
        },
      }}
      initial="hidden"
      {...(trigger === 'mount'
        ? { animate: 'visible' }
        : {
            whileInView: 'visible',
            viewport: { once: true, amount: 0.3 },
          })}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-flex"
          aria-hidden="true"
          style={{
            marginRight: wi < words.length - 1 ? '0.25em' : undefined,
          }}>
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              data-blurin=""
              className={charClassName}
              style={{ willChange: 'filter, transform, opacity' }}
              variants={{
                hidden: { opacity: 0, filter: `blur(${blur}px)`, y },
                visible: {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  transition: { duration, ease: EASE_OUT_EXPO },
                },
              }}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

type BlurInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  trigger?: 'mount' | 'view';
};

export function BlurIn({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 20,
  blur = 12,
  once = true,
  trigger = 'view',
}: BlurInProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const target = { opacity: 1, y: 0, filter: 'blur(0px)' };

  return (
    <motion.div
      data-blurin=""
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      {...(trigger === 'mount'
        ? { animate: target }
        : {
            whileInView: target,
            viewport: { once, amount: 0.3 },
          })}
      transition={{ duration, delay: scaleDelay(delay), ease: EASE_OUT_EXPO }}>
      {children}
    </motion.div>
  );
}

type StaggerListProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
};

export function StaggerList({ children, className = '', delay = 0, stagger = 0.15, style }: StaggerListProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger * STAGGER_SCALE, delayChildren: scaleDelay(delay) },
        },
      }}>
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export function StaggerItem({
  children,
  className = '',
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  const reduce = useReducedMotion();

  if (reduce)
    return (
      <div
        className={className}
        style={style}
        {...rest}>
        {children}
      </div>
    );

  return (
    <motion.div
      data-blurin=""
      className={className}
      style={{ ...style }}
      variants={staggerItem}
      {...rest}>
      {children}
    </motion.div>
  );
}
