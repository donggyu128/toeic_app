import { useCallback, useEffect, useRef } from 'react';
import { PageContainer }       from '../components/ui.jsx';
import { TestTopBar }          from '../components/test/TestTopBar.jsx';
import { QuestionCard }        from '../components/test/QuestionCard.jsx';
import { ChoiceList }          from '../components/test/ChoiceList.jsx';
import { WrongAnswerFeedback } from '../components/test/WrongAnswerFeedback.jsx';

export default function TestPage({
  currentWord,
  choices,
  answered,
  currentIndex,
  total,
  isWrongTest,
  onSubmit,
  onNext,
  onGoHome,
}) {
  const progressPct = ((currentIndex + 1) / total) * 100;
  const confirmRef  = useRef(null);

  // 정답: 800ms 후 자동 이동 / 오답: 확인 버튼에 포커스
  useEffect(() => {
    if (!answered) return;
    if (answered.correct) {
      const id = setTimeout(onNext, 800);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => confirmRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [answered, onNext]);

  // onGoHome이 안정화된 참조이므로 useCallback deps가 안전함
  const handleGoHome = useCallback(() => {
    if (window.confirm('테스트를 종료하시겠어요?\n지금까지 푼 내용은 저장됩니다.')) {
      onGoHome();
    }
  }, [onGoHome]);

  if (!currentWord) return null;

  return (
    <PageContainer maxWidth={560} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TestTopBar
        isWrongTest={isWrongTest}
        currentIndex={currentIndex}
        total={total}
        progressPct={progressPct}
        onGoHome={handleGoHome}
      />
      <QuestionCard currentIndex={currentIndex} english={currentWord.english} />
      <ChoiceList
        choices={choices}
        currentWord={currentWord}
        answered={answered}
        onSubmit={onSubmit}
      />
      <WrongAnswerFeedback
        answered={answered}
        currentWord={currentWord}
        confirmRef={confirmRef}
        onNext={onNext}
      />
    </PageContainer>
  );
}
