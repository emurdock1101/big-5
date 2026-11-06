import ProgressBar from '../components/ProgressBar';
import {Question} from '../constants/schema';
import QuestionComp from './QuestionComp';
import {useState, useEffect} from 'react';
import React from 'react';

interface QuestionPackProps {
  totalQuestions: number;
  questions: Question[];
  page: number;
  prevStep: () => void;
  nextStep: () => void;
}

const QuestionPack: React.FC<QuestionPackProps> = (props: QuestionPackProps) => {
  const numberOfPages = props.totalQuestions / props.questions.length;
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [showMissing, setShowMissing] = useState(false);

  const countAnswer = (uid: string) => {
    if (!answeredQuestions.includes(uid)) {
      setAnsweredQuestions([...answeredQuestions, uid]);
    }
  };

  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
  }, []);

  const remaining = props.questions.length - answeredQuestions.length;
  const done = remaining === 0;

  const nav = (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'}}>
      <button type='button' className='pp-btn pp-btn--ghost pp-btn--sm' disabled={props.page === 1} onClick={props.prevStep}>
        Back
      </button>
      <span className='pp-small' aria-live='polite'>
        {done ? 'Page complete' : `${remaining} left on this page`}
      </span>
      <button
        type='button'
        className='pp-btn pp-btn--sm'
        onClick={() => {
          if (done) {
            props.nextStep();
            return;
          }
          setShowMissing(true);
          window.setTimeout(() => {
            const first = document.querySelector('[data-missing="true"]');
            first?.scrollIntoView({block: 'center'});
            (first?.querySelector('[role="radio"]') as HTMLElement | null)?.focus();
          }, 30);
        }}>
        {props.page === numberOfPages ? 'Finish' : 'Next page'}
      </button>
    </div>
  );

  return (
    <div className='pp'>
      <div className='pp-header' style={{top: 'var(--pp-header-h)', zIndex: 1000}}>
        <div className='pp-wrap' style={{padding: '14px var(--pp-gutter)', display: 'grid', gap: 8, maxWidth: 920}}>
          <span style={{fontWeight: 700, fontSize: 15}}>
            Page {props.page} of {numberOfPages}
          </span>
          <ProgressBar
            progress={(((props.page - 1) * props.questions.length + answeredQuestions.length) / props.totalQuestions) * 100}
          />
        </div>
      </div>
      <div className='pp-wrap' style={{maxWidth: 920, padding: '24px var(--pp-gutter) 96px'}}>
        <p className='pp-small' style={{margin: '8px 0 0'}}>
          How well does each statement describe you? Go with your first instinct.
        </p>
        {props.questions.map((question) => (
          <QuestionComp key={question.uid} question={question} countAnswer={countAnswer} showMissing={showMissing} />
        ))}
        <div style={{marginTop: 32}}>{nav}</div>
      </div>
    </div>
  );
};

export default QuestionPack;
