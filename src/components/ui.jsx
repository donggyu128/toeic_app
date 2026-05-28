import { forwardRef } from 'react';

// ─── 변형 스타일 — 컴포넌트 외부에 정의해 렌더마다 재생성 방지 ──

const BUTTON_VARIANTS = {
  neutral: {
    background: 'var(--c-surface)',
    border:     '1px solid var(--c-border)',
    color:      'var(--c-text)',
  },
  accent: {
    background: 'rgba(124,109,250,0.1)',
    border:     '1px solid rgba(124,109,250,0.3)',
    color:      'var(--c-accent)',
  },
  danger: {
    background: 'rgba(250,109,109,0.1)',
    border:     '1px solid rgba(250,109,109,0.3)',
    color:      '#f87171',
  },
  ghost: {
    background: 'none',
    border:     'none',
    color:      'var(--c-muted)',
    padding:    0,
  },
};

const BASE_BUTTON_STYLE = {
  borderRadius: '12px',
  padding:      '0.9rem',
  cursor:       'pointer',
  fontSize:     '0.9rem',
};

// ─── PageContainer ────────────────────────────────────────────

export function PageContainer({ maxWidth = 720, style, children }) {
  return (
    <div style={{ maxWidth, margin: '0 auto', padding: '2rem 1.5rem', ...style }}>
      {children}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────

export function Card({ className = '', style, children, ...props }) {
  return (
    <div
      className={className}
      style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: '12px', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────

export const Button = forwardRef(function Button(
  { variant = 'neutral', className = 'ui-interactive', style, children, ...props },
  ref,
) {
  const variantStyle = BUTTON_VARIANTS[variant] ?? BUTTON_VARIANTS.neutral;
  return (
    <button
      ref={ref}
      className={className}
      style={{ ...BASE_BUTTON_STYLE, ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  );
});
