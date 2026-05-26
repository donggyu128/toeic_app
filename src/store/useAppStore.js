import { useReducer, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import { shuffle, generateChoices } from '../utils/wordset.js';
import RAW_WORDS from '../data/words.js';

// ── State shape ──────────────────────────────────────────────
// {
//   view: 'home' | 'test' | 'result' | 'wrongnote' | 'wrongtest',
//   testWords: Word[],
//   currentIndex: number,
//   choices: Word[],
//   answered: null | { selected: Word, correct: boolean },
//   answers: { word: Word, correct: boolean }[],
//   wrongNote: WrongNoteItem[],   // persisted
//   isWrongTest: boolean,
// }
//
// WrongNoteItem: { word, wrongCount, consecutiveCorrect }

function loadWrongNote() {
  return storage.getWrongNote();
}

const INIT = {
  view: 'home',
  testWords: [],
  currentIndex: 0,
  choices: [],
  answered: null,
  answers: [],
  wrongNote: loadWrongNote(),
  isWrongTest: false,
};

function makeChoices(word) {
  return generateChoices(word, RAW_WORDS);
}

function reducer(state, action) {
  switch (action.type) {

    case 'START_TEST': {
      const words = shuffle(action.words);
      return {
        ...state,
        view: 'test',
        testWords: words,
        currentIndex: 0,
        choices: makeChoices(words[0]),
        answered: null,
        answers: [],
        isWrongTest: false,
      };
    }

    case 'START_WRONG_TEST': {
      const words = shuffle(state.wrongNote.map(i => i.word));
      if (words.length === 0) return state;
      return {
        ...state,
        view: 'test',
        testWords: words,
        currentIndex: 0,
        choices: makeChoices(words[0]),
        answered: null,
        answers: [],
        isWrongTest: true,
      };
    }

    case 'SUBMIT_ANSWER': {
      const { selected } = action;
      const currentWord = state.testWords[state.currentIndex];
      const correct = selected.id === currentWord.id;
      return {
        ...state,
        answered: { selected, correct },
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.testWords.length) {
        // Test done → compute results & update wrong note
        const wrongWords = state.answers
          .filter(a => !a.correct)
          .map(a => a.word);

        // Merge with existing wrong note
        let wrongNote = [...state.wrongNote];

        if (!state.isWrongTest) {
          // Normal test: add new wrong words
          wrongWords.forEach(w => {
            const idx = wrongNote.findIndex(i => i.word.id === w.id);
            if (idx >= 0) {
              wrongNote[idx] = { ...wrongNote[idx], wrongCount: wrongNote[idx].wrongCount + 1, consecutiveCorrect: 0 };
            } else {
              wrongNote.push({ word: w, wrongCount: 1, consecutiveCorrect: 0 });
            }
          });
        } else {
          // Wrong test: update consecutiveCorrect / wrongCount per answer
          state.answers.forEach(({ word, correct }) => {
            const idx = wrongNote.findIndex(i => i.word.id === word.id);
            if (idx < 0) return;
            if (correct) {
              const newConsec = wrongNote[idx].consecutiveCorrect + 1;
              if (newConsec >= 3) {
                wrongNote.splice(idx, 1); // auto-delete
              } else {
                wrongNote[idx] = { ...wrongNote[idx], consecutiveCorrect: newConsec };
              }
            } else {
              wrongNote[idx] = { ...wrongNote[idx], wrongCount: wrongNote[idx].wrongCount + 1, consecutiveCorrect: 0 };
            }
          });
        }

        storage.saveWrongNote(wrongNote);
        return {
          ...state,
          view: 'result',
          wrongNote,
        };
      }

      // Record current answer
      const prevAnswer = state.answered;
      const newAnswers = [
        ...state.answers,
        { word: state.testWords[state.currentIndex], correct: prevAnswer?.correct ?? false },
      ];

      const nextWord = state.testWords[nextIndex];
      return {
        ...state,
        currentIndex: nextIndex,
        choices: makeChoices(nextWord),
        answered: null,
        answers: newAnswers,
      };
    }

    case 'GO_HOME':
      return { ...state, view: 'home', answers: [], answered: null };

    case 'GO_WRONG_NOTE':
      return { ...state, view: 'wrongnote' };

    case 'DELETE_WRONG_ITEM': {
      const wrongNote = state.wrongNote.filter(i => i.word.id !== action.wordId);
      storage.saveWrongNote(wrongNote);
      return { ...state, wrongNote };
    }

    default:
      return state;
  }
}

export function useAppStore() {
  const [state, dispatch] = useReducer(reducer, INIT);

  const startTest       = useCallback(words => dispatch({ type: 'START_TEST', words }), []);
  const startWrongTest  = useCallback(() => dispatch({ type: 'START_WRONG_TEST' }), []);
  const submitAnswer    = useCallback(selected => dispatch({ type: 'SUBMIT_ANSWER', selected }), []);
  const nextQuestion    = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const goHome          = useCallback(() => dispatch({ type: 'GO_HOME' }), []);
  const goWrongNote     = useCallback(() => dispatch({ type: 'GO_WRONG_NOTE' }), []);
  const deleteWrongItem = useCallback(wordId => dispatch({ type: 'DELETE_WRONG_ITEM', wordId }), []);

  return { state, startTest, startWrongTest, submitAnswer, nextQuestion, goHome, goWrongNote, deleteWrongItem };
}
