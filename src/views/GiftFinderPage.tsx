import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Storage} from '@aws-amplify/storage';
import {Auth} from 'aws-amplify';
import GiftFinderSaved from '../design/GiftFinderSaved';
import {privateStore} from '../utils/giftFinderStore';

/**
 * The real Gift Finder: the signed-in person's own scores, filled in from their saved results,
 * with progress saved privately to their account.
 *
 * Stage 1 (Nov 2026): open to admins only, for testing. Payment and the "bought it" check come later.
 */

interface S3Results {
  name?: string;
  percentiles?: Record<string, number>;
}

const GiftFinderPage: React.FC = () => {
  const [results, setResults] = useState<{name: string; percentiles: Record<string, number>} | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const email: string = user.attributes?.email ?? 'email_unknown';
        const subId: string = user.attributes?.sub ?? 'subId_unknown';
        Storage.configure({bucket: process.env.REACT_APP_BUCKET_NAME, region: 'us-east-1'});
        const url: string = await Storage.get(`${email}-${subId}/${email}-results`);
        const data: S3Results = await fetch(url).then((r) => r.json());
        if (!data?.percentiles || Object.keys(data.percentiles).length === 0) throw new Error('No results yet');
        setResults({name: (data.name ?? '').trim(), percentiles: data.percentiles});
      } catch (e) {
        console.error(e);
        setFailed(true);
      }
    };
    load();
  }, []);

  if (failed) {
    return (
      <div className='pp pp-wrap pp-pagehead'>
        <h1 className='pp-display pp-h2'>Your scores come first</h1>
        <p className='pp-lede'>
          The Gift Finder starts from your test results, and we couldn’t find them. If you’ve taken the test, refresh
          the page.
        </p>
        <p>
          <Link to='/results' className='pp-textlink'>
            Go to your results
          </Link>
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className='pp pp-wrap pp-pagehead' aria-busy='true'>
        <p className='pp-lede'>Opening your Gift Finder…</p>
      </div>
    );
  }

  return (
    <GiftFinderSaved
      store={privateStore}
      percentiles={results.percentiles}
      name={results.name || undefined}
      saveNote='Saves privately to your account as you type. Only you can read what you write.'
    />
  );
};

export default GiftFinderPage;
