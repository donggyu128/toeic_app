import { useCallback, useEffect, useRef, useState } from 'react';
import { PageContainer }       from '../components/ui.jsx';
import { TestTopBar }          from '../components/test/TestTopBar.jsx';
import { QuestionCard }        from '../components/test/QuestionCard.jsx';
import { ChoiceList }          from '../components/test/ChoiceList.jsx';
import { SubjectiveInput }     from '../components/test/SubjectiveInput.jsx';
import { WrongAnswerFeedback } from '../components/test/WrongAnswerFeedback.jsx';

export default function TestPage({
  currentWord,
  choices,
  answered,
  currentIndex,
  total,
  isWrongTest,
  questionMode,
  vocabType,
  onSubmit,
  onNext,
  onGoHome,
}) {
  const progressPct = ((currentIndex + 1) / total) * 100;
  const confirmRef  = useRef(null);
  const [typedAnswer, setTypedAnswer] = useState('');

  // 문제 바뀔 때 입력 초기화
  useEffect(() => { setTypedAnswer(''); }, [currentIndex]);

  useEffect(() => {
    if (!answered) return;
    if (answered.correct) {
      const id = setTimeout(onNext, 800);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => confirmRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [answered, onNext]);

  const handleGoHome = useCallback(() => {
    if (window.confirm('테스트를 종료하시겠어요?\n지금까지 푼 내용은 저장됩니다.')) {
      onGoHome();
    }
  }, [onGoHome]);

  const handleSubjectiveSubmit = useCallback(() => {
    if (!typedAnswer.trim()) return;
    onSubmit(null, typedAnswer);
  }, [typedAnswer, onSubmit]);

  if (!currentWord) return null;

  return (
    <PageContainer maxWidth={560} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TestTopBar
        isWrongTest={isWrongTest}
        currentIndex={currentIndex}
        total={total}
        progressPct={progressPct}
        onGoHome={handleGoHome}
        questionMode={questionMode}
        vocabType={vocabType}
      />
      <QuestionCard
        currentIndex={currentIndex}
        word={currentWord}
        vocabType={vocabType}
        questionMode={questionMode}
      />

      {questionMode === 'subjective' ? (
        <SubjectiveInput
          word={currentWord}
          vocabType={vocabType}
          answered={answered}
          typedAnswer={typedAnswer}
          onType={setTypedAnswer}
          onSubmit={handleSubjectiveSubmit}
          onNext={onNext}
          confirmRef={confirmRef}
        />
      ) : (
        <ChoiceList
          choices={choices}
          currentWord={currentWord}
          answered={answered}
          onSubmit={onSubmit}
          vocabType={vocabType}
        />
      )}

      {questionMode === 'multiple' && (
        <WrongAnswerFeedback
          answered={answered}
          currentWord={currentWord}
          confirmRef={confirmRef}
          onNext={onNext}
          vocabType={vocabType}
        />
      )}
    </PageContainer>
  );
}
