import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore.js';
import HomePage      from './pages/HomePage.jsx';
import TestPage      from './pages/TestPage.jsx';
import ResultPage    from './pages/ResultPage.jsx';
import WrongNotePage from './pages/WrongNotePage.jsx';

// 오타 방지 및 자동완성을 위한 view 상수
const VIEWS = Object.freeze({
  HOME:       'home',
  TEST:       'test',
  RESULT:     'result',
  WRONG_NOTE: 'wrongnote',
});

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const {
    testState,
    wrongNote,
    progress,
    startTest,
    startWrongTest,
    submitAnswer,
    nextQuestion,
    resetTest,
    deleteWrongItem,
  } = useAppStore();

  const handleStartTest = useCallback((words) => {
    startTest(words);
    setView(VIEWS.TEST);
  }, [startTest]);

  const handleStartWrongTest = useCallback(() => {
    startWrongTest();
    setView(VIEWS.TEST);
  }, [startWrongTest]);

  const handleGoHome = useCallback(() => {
    resetTest();
    setView(VIEWS.HOME);
  }, [resetTest]);

  const handleGoWrongNote = useCallback(() => setView(VIEWS.WRONG_NOTE), []);

  // 테스트 완료 → 결과 화면 전환
  // view 조건 포함: 다른 화면에서 isDone이 true로 남아있어도 불필요한 전환 방지
  useEffect(() => {
    if (view === VIEWS.TEST && testState.isDone) {
      setView(VIEWS.RESULT);
    }
  }, [view, testState.isDone]);

  if (view === VIEWS.TEST) return (
    <TestPage
      currentWord={testState.currentWord}
      choices={testState.choices}
      answered={testState.answered}
      currentIndex={testState.currentIndex}
      total={testState.testWords.length}
      isWrongTest={testState.isWrongTest}
      onSubmit={submitAnswer}
      onNext={nextQuestion}
      onGoHome={handleGoHome}
    />
  );

  if (view === VIEWS.RESULT) return (
    <ResultPage
      answers={testState.answers}
      isWrongTest={testState.isWrongTest}
      onGoHome={handleGoHome}
      onGoWrongNote={handleGoWrongNote}
    />
  );

  if (view === VIEWS.WRONG_NOTE) return (
    <WrongNotePage
      wrongNote={wrongNote}
      onStartWrongTest={handleStartWrongTest}
      onDelete={deleteWrongItem}
      onGoHome={handleGoHome}
    />
  );

  return (
    <HomePage
      progress={progress}
      wrongNoteCount={wrongNote.length}
      onStartTest={handleStartTest}
      onGoWrongNote={handleGoWrongNote}
    />
  );
}
