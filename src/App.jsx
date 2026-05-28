import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore.js';
import HomePage      from './pages/HomePage.jsx';
import TestPage      from './pages/TestPage.jsx';
import ResultPage    from './pages/ResultPage.jsx';
import WrongNotePage from './pages/WrongNotePage.jsx';

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
    hskProgress,
    startTest,
    startWrongTest,
    startWrongSetTest,
    submitAnswer,
    nextQuestion,
    resetTest,
    deleteWrongItem,
  } = useAppStore();

  const handleStartTest = useCallback((words, questionMode, vocabType) => {
    startTest(words, questionMode, vocabType);
    setView(VIEWS.TEST);
  }, [startTest]);

  const handleStartWrongTest = useCallback((questionMode) => {
    startWrongTest(questionMode);
    setView(VIEWS.TEST);
  }, [startWrongTest]);

  const handleStartWrongSetTest = useCallback((words, questionMode, vocabType) => {
    startWrongSetTest(words, questionMode, vocabType);
    setView(VIEWS.TEST);
  }, [startWrongSetTest]);

  const handleGoHome = useCallback(() => {
    resetTest();
    setView(VIEWS.HOME);
  }, [resetTest]);

  const handleGoWrongNote = useCallback(() => setView(VIEWS.WRONG_NOTE), []);

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
      questionMode={testState.questionMode}
      vocabType={testState.vocabType}
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
      onStartWrongSetTest={handleStartWrongSetTest}
      onDelete={deleteWrongItem}
      onGoHome={handleGoHome}
    />
  );

  return (
    <HomePage
      progress={progress}
      hskProgress={hskProgress}
      wrongNoteCount={wrongNote.length}
      onStartTest={handleStartTest}
      onGoWrongNote={handleGoWrongNote}
    />
  );
}
