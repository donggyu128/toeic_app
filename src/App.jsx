import { useAppStore } from './store/useAppStore.js';
import HomePage      from './pages/HomePage.jsx';
import TestPage      from './pages/TestPage.jsx';
import ResultPage    from './pages/ResultPage.jsx';
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
      progress={state.progress}
    />
  );
}