import { Button, PageContainer } from '../components/ui.jsx';
import { ResultSummary }   from '../components/result/ResultSummary.jsx';
import { ResultStatsGrid } from '../components/result/ResultStatsGrid.jsx';
import { WrongWordsList }  from '../components/result/WrongWordsList.jsx';
import { calcGrade }       from '../utils/grade.js';

export default function ResultPage({ answers, isWrongTest, onGoHome, onGoWrongNote }) {
  const { correctCount, wrongWords } = answers.reduce(
    (acc, a) => {
      if (a.correct) acc.correctCount++;
      else acc.wrongWords.push(a.word);
      return acc;
    },
    { correctCount: 0, wrongWords: [] },
  );

  const total = answers.length;
  const wrong = total - correctCount;
  const pct   = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const grade = calcGrade(pct);

  return (
    <PageContainer maxWidth={480} style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
      <div className="anim-fade-up">
        <ResultSummary isWrongTest={isWrongTest} grade={grade} pct={pct} />
        <ResultStatsGrid total={total} correct={correctCount} wrong={wrong} />
        <WrongWordsList wrongWords={wrongWords} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {wrong > 0 ? (
            <Button
              variant="danger"
              onClick={onGoWrongNote}
              style={{ padding: '0.9rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
            >
              {isWrongTest ? '오답노트 돌아가기' : '오답노트 보기'}
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={onGoHome}
              style={{ padding: '0.9rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
            >
              🎉 완벽해요! 홈으로
            </Button>
          )}
          <Button
            onClick={onGoHome}
            style={{ padding: '0.9rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            홈으로
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
