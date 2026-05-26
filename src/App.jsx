import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore.js';
import { storage } from './utils/storage.js';
import { getSetNumber } from './utils/wordset.js';
import HomePage     from './pages/HomePage.jsx';
import TestPage     from './pages/TestPage.jsx';
import ResultPage   from './pages/ResultPage.jsx';
import WrongNotePage from './pages/WrongNotePage.jsx';

export default function App() {
  const {
    state,
    startTest,
    startWrongTest,
    submitAnswer,
    nextQuestion,
    goHome,
    goWrongNote,
    deleteWrongItem,
  } = useAppStore();

  // Save progress when test completes
  useEffect(() => {
    if (state.view === 'result' && !state.isWrongTest) {
      const progress = storage.getProgress();
      const setNum = getSetNumber(state.testWords[0]?.id ?? 1);
      const correctCount = state.answers.filter(a => a.correct).length;
      const prev = progress[setNum] ?? 0;
      progress[setNum] = Math.max(prev, correctCount);
      storage.saveProgress(progress);
    }
  }, [state.view]);

  const { view } = state;

  if (view === 'test') {
    return (
      <TestPage
        state={state}
        onSubmit={submitAnswer}
        onNext={nextQuestion}
        onGoHome={goHome}
      />
    );
  }

  if (view === 'result') {
    return (
      <ResultPage
        state={state}
        onGoHome={goHome}
        onGoWrongNote={goWrongNote}
      />
    );
  }

  if (view === 'wrongnote') {
    return (
      <WrongNotePage
        wrongNote={state.wrongNote}
        onStartWrongTest={startWrongTest}
        onDelete={deleteWrongItem}
        onGoHome={goHome}
      />
    );
  }

  return (
    <HomePage
      onStartTest={startTest}
      onGoWrongNote={goWrongNote}
      wrongNoteCount={state.wrongNote.length}
    />
  );
}
