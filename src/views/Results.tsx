import React, {useEffect, useState} from 'react';
import {Storage} from '@aws-amplify/storage';
import {Auth} from 'aws-amplify';
import ResultsWalk from '../design/ResultsWalk';
import {generateReport} from '../utils/report.pdf';
import {treePng} from '../design/tree';
import ShareManager from '../design/ShareManager';
import {cleanName} from '../utils/report.pdf';

interface S3Results {
  name: string;
  gender: string;

  percentiles: Record<string, number>;
}

const Results: React.FC = () => {
  const [percentiles, setPercentiles] = useState<Record<string, number> | null>(null);
  const [gender, setGender] = useState('gender');
  const [name, setName] = useState('');
  const [failed, setFailed] = useState(false);

  const downloadResults = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes?.email ?? '';

    const treeImage = percentiles ? await treePng(percentiles, name) : null;
    generateReport({name, email, gender, percentiles, treeImage});
  };

  useEffect(() => {
    const getResultsFromS3 = async (): Promise<void> => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const email: string = user.attributes?.email ?? 'email_unknown';
        const subId: string = user.attributes?.sub ?? 'subId_unknown';

        Storage.configure({
          bucket: process.env.REACT_APP_BUCKET_NAME,
          region: 'us-east-1',
        });

        const url: string = await Storage.get(`${email}-${subId}/${email}-results`);
        const dataWithUserInfo: S3Results = await fetch(url).then((response) => response.json());
        setGender(dataWithUserInfo.gender);
        setName(dataWithUserInfo.name ?? '');
        setPercentiles(dataWithUserInfo.percentiles);
      } catch (error) {
        console.error(error);
        setFailed(true);
      }
    };
    getResultsFromS3();
  }, []);

  if (failed) {
    return (
      <div className='pp pp-wrap pp-pagehead'>
        <h1 className='pp-display pp-h2'>We couldn’t load your results</h1>
        <p className='pp-lede'>Check your connection and refresh the page. If it keeps happening, contact us.</p>
      </div>
    );
  }

  if (!percentiles) {
    return (
      <div className='pp pp-wrap pp-pagehead' aria-busy='true'>
        <p className='pp-lede'>Loading your results…</p>
      </div>
    );
  }

  return (
    <ResultsWalk
      look='cinematic'
      percentiles={percentiles}
      gender={gender}
      name={name}
      onDownload={downloadResults}
      share={<ShareManager name={cleanName(name)} gender={gender} percentiles={percentiles} />}
    />
  );
};

export default Results;
