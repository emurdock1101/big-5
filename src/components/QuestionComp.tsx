import {Question} from '../constants/schema';
import {useEffect, useState} from 'react';

interface QuestionProps {
  question: Question;
  countAnswer: (uid: string) => void;
  /** Flag the question if it is still unanswered (after the person tries to move on). */
  showMissing?: boolean;
}

const LABELS = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

/** One statement with all five answers always visible; the chosen one is struck forward. */
const QuestionComp: React.FC<QuestionProps> = (props: QuestionProps) => {
  const [selected, setSelected] = useState(() => {
    const stored = sessionStorage.getItem(JSON.stringify(props.question));
    return stored !== null ? parseInt(stored) : 99;
  });

  // Scored value for each position, left to right (reversed questions score the other way).
  const values = props.question.reverse ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];

  useEffect(() => {
    sessionStorage.setItem(JSON.stringify(props.question), '' + selected);
    if (selected !== 99) {
      props.countAnswer(props.question.uid);
    }
  });

  const labelId = `q-${props.question.uid}`;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : null;
    if (next === null || next < 0 || next > 4) return;
    e.preventDefault();
    setSelected(values[next]);
    const group = (e.currentTarget as HTMLElement).parentElement;
    (group?.children[next] as HTMLElement | undefined)?.focus();
  };

  const chosenIndex = values.indexOf(selected);

  return (
    <div className='pp-question' data-missing={selected === 99 && props.showMissing ? 'true' : undefined}>
      <p id={labelId} style={{margin: 0, fontSize: 'clamp(19px, 1.7vw, 22px)', fontWeight: 650, lineHeight: 1.35}}>
        {props.question.text}
        {selected === 99 && props.showMissing && <span className='pp-question__todo'>Not answered yet</span>}
      </p>
      <div className='pp-answers' role='radiogroup' aria-labelledby={labelId}>
        {LABELS.map((label, i) => (
          <button
            key={label}
            type='button'
            role='radio'
            className='pp-answer'
            aria-checked={selected === values[i]}
            tabIndex={chosenIndex === -1 ? (i === 0 ? 0 : -1) : chosenIndex === i ? 0 : -1}
            onClick={() => setSelected(values[i])}
            onKeyDown={(e) => onKey(e, i)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
export default QuestionComp;
