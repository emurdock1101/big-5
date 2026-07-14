import {Question} from '../constants/schema';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@material-ui/core';
import {useEffect, useState} from 'react';

interface QuestionProps {
  question: Question;
  countAnswer: (uid: string) => void;
}

const QuestionComp: React.FC<QuestionProps> = (props: QuestionProps) => {
  const [selected, setSelected] = useState(() => {
    const selected = sessionStorage.getItem(JSON.stringify(props.question));
    return selected !== null ? parseInt(selected) : 99;
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 700) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const radio1: number = props.question.reverse ? 5 : 1;
  const radio2: number = props.question.reverse ? 4 : 2;
  const radio3: number = 3;
  const radio4: number = props.question.reverse ? 2 : 4;
  const radio5: number = props.question.reverse ? 1 : 5;

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    sessionStorage.setItem(JSON.stringify(props.question), '' + selected);
    if (selected !== 99) {
      props.countAnswer(props.question.uid);
    }
  });

  return (
    <FormControl>
      <FormLabel>
        <p>
          {props.question.text} <span style={{color: '#ED5362'}}>{selected === 99 ? '*' : ''}</span>
        </p>
      </FormLabel>
      <RadioGroup row={!isMobile} value={selected}>
        <FormControlLabel
          value={radio1}
          control={<Radio color='primary' checked={selected === radio1} onClick={() => setSelected(radio1)} />}
          label='Strongly Disagree'
        />
        <FormControlLabel
          value={radio2}
          control={<Radio color='primary' checked={selected === radio2} onClick={() => setSelected(radio2)} />}
          label='Disagree'
        />
        <FormControlLabel
          value={radio3}
          control={<Radio color='primary' checked={selected === radio3} onClick={() => setSelected(radio3)} />}
          label='Neutral'
        />
        <FormControlLabel
          value={radio4}
          control={<Radio color='primary' checked={selected === radio4} onClick={() => setSelected(radio4)} />}
          label='Agree'
        />
        <FormControlLabel
          value={radio5}
          control={<Radio color='primary' checked={selected === radio5} onClick={() => setSelected(radio5)} />}
          label='Strongly Agree'
        />
      </RadioGroup>
    </FormControl>
  );
};
export default QuestionComp;
