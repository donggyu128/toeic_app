import { Button } from '../ui.jsx';

const LABELS = ['A', 'B', 'C', 'D'];

function resolveChoiceAppearance(choice, correctWord, answered) {
  if (!answered) {
    return { bg: 'var(--c-surface)', border: 'var(--c-border)', color: 'var(--c-text)', animClass: '' };
  }

  const isCorrectAnswer  = choice.id === correctWord.id;
  const isSelectedWrong  = answered.selected.id === choice.id && !answered.correct;

  if (isCorrectAnswer) {
    return {
      bg:        'rgba(34,197,94,0.12)',
      border:    '#22c55e',
      color:     '#4ade80',
      animClass: answered.correct && answered.selected.id === choice.id ? 'anim-correct' : '',
    };
  }
  if (isSelectedWrong) {
    return { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', color: '#f87171', animClass: 'anim-wrong' };
  }
  return { bg: 'var(--c-surface)', border: 'var(--c-border)', color: 'var(--c-muted)', animClass: '' };
}

export function ChoiceList({ choices, currentWord, answered, onSubmit }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
      {choices.map((choice, index) => {
        const { bg, border, color, animClass } = resolveChoiceAppearance(choice, currentWord, answered);
        return (
          <Button
            key={choice.id}
            className={[animClass, 'ui-interactive'].filter(Boolean).join(' ')}
            disabled={!!answered}
            onClick={() => onSubmit(choice)}
            style={{
              background: bg, border: `1px solid ${border}`, color,
              borderRadius: '12px', padding: '1rem 1.25rem',
              textAlign: 'left', cursor: answered ? 'default' : 'pointer',
              fontSize: '0.9rem', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
          >
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--c-muted)', minWidth: '1.2rem' }}>
              {LABELS[index] ?? '?'}
            </span>
            {choice.korean}
          </Button>
        );
      })}
    </div>
  );
}
