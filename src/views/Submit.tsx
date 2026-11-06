import {Storage} from '@aws-amplify/storage';
import {Auth} from 'aws-amplify';
import {getPercentiles} from '../utils/scoring.utils';
import {useNavigate} from 'react-router-dom';
import {Aspect, Ocean} from '../constants/schema';
import React, {useEffect, useState} from 'react';
import Strip from '../design/Strip';

interface SubmitProps {
  prevStep: () => void;
  onComplete: () => void;
}

const Submit: React.FC<SubmitProps> = (props: SubmitProps) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({top: 0, left: 0});
  }, []);

  const processResults = async () => {
    setBusy(true);
    setError(false);
    try {
      const user = await Auth.currentAuthenticatedUser();
      const email: string = user.attributes.email;
      const subId: string = user.attributes.sub;
      const percentiles: Record<string, number> = getPercentiles();
      const name: string = sessionStorage.getItem('name') ?? 'name_unknown';
      const gender: string = sessionStorage.getItem('gender') ?? 'gender_unknown';
      const orderedPercentiles: Record<string, number> = {
        [Ocean.Extraversion]: percentiles[Ocean.Extraversion],
        [Aspect.Enthusiasm]: percentiles[Aspect.Enthusiasm],
        [Aspect.Assertiveness]: percentiles[Aspect.Assertiveness],

        [Ocean.Neuroticism]: percentiles[Ocean.Neuroticism],
        [Aspect.Withdrawal]: percentiles[Aspect.Withdrawal],
        [Aspect.Volatility]: percentiles[Aspect.Volatility],

        [Ocean.Agreeableness]: percentiles[Ocean.Agreeableness],
        [Aspect.Compassion]: percentiles[Aspect.Compassion],
        [Aspect.Politeness]: percentiles[Aspect.Politeness],

        [Ocean.Conscientiousness]: percentiles[Ocean.Conscientiousness],
        [Aspect.Industriousness]: percentiles[Aspect.Industriousness],
        [Aspect.Orderliness]: percentiles[Aspect.Orderliness],

        [Ocean.Openness]: percentiles[Ocean.Openness],
        [Aspect.AestheticOpenness]: percentiles[Aspect.AestheticOpenness],
        [Aspect.Interest]: percentiles[Aspect.Interest],
      };

      const testResultsObj = {
        name,
        gender,
        percentiles: orderedPercentiles,
      };

      Storage.configure({
        bucket: process.env.REACT_APP_BUCKET_NAME,
        region: 'us-east-1',
      });

      await Storage.put(`${email}-${subId}/${email}-results`, testResultsObj, {
        contentType: 'application/json',
      });

      props.onComplete();
      navigate('/results');
    } catch (e) {
      console.error(e);
      setError(true);
      setBusy(false);
    }
  };

  return (
    <div className='pp'>
      <div className='pp-wrap pp-pagehead'>
        <Strip />
        <h1 className='pp-display pp-h1'>That’s all 100.</h1>
        <p className='pp-lede' style={{maxWidth: '50ch'}}>
          When you submit, your answers are scored and your results are saved to your account for good. You can’t change
          them after this, so go back now if you want to look over anything.
        </p>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginTop: 8}}>
          <button type='button' className='pp-btn' onClick={processResults} disabled={busy}>
            {busy ? 'Scoring your answers…' : 'Submit and see my results'}
          </button>
          <button type='button' className='pp-btn pp-btn--ghost' onClick={props.prevStep} disabled={busy}>
            Back to the questions
          </button>
        </div>
        {error && (
          <p role='alert' className='pp-alert'>
            Your results didn’t save. Your answers are still here, so check your connection and press Submit again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Submit;
