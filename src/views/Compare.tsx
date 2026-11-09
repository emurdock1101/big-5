import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {UserContext} from '../App';
import CompareView from '../design/CompareView';
import Strip from '../design/Strip';
import {PRICE} from '../design/traits';
import {loadMyResults, loadShare, myIdentityId, setReturnPath, ShareRecord} from '../utils/share';

type State =
  | {kind: 'loading'}
  | {kind: 'missing'}
  | {kind: 'unlinked'}
  | {kind: 'own'}
  | {kind: 'no-results'}
  | {kind: 'ready'; share: ShareRecord; me: {name: string; percentiles: Record<string, number>}};

const Notice: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div className='pp'>
    <div className='pp-wrap pp-pagehead' style={{paddingBottom: 'clamp(72px, 10vw, 140px)'}}>
      <Strip />
      <h1 className='pp-display pp-h2'>{title}</h1>
      {children}
    </div>
  </div>
);

/** /compare/:owner/:share — someone opened a share link. */
const Compare: React.FC = () => {
  const {owner = '', share = ''} = useParams();
  const {user} = useContext(UserContext);
  const [state, setState] = useState<State>({kind: 'loading'});
  const here = `/compare/${encodeURIComponent(owner)}/${share}`;

  useEffect(() => {
    if (!user.loggedIn) return;
    let live = true;
    (async () => {
      if ((await myIdentityId().catch(() => '')) === owner) return live && setState({kind: 'own'});
      const [rec, mine] = await Promise.all([loadShare(owner, share), loadMyResults()]);
      if (!live) return;
      if (!rec) return setState({kind: 'missing'});
      if (rec.revoked) return setState({kind: 'unlinked'});
      if (!mine) return setState({kind: 'no-results'});
      setState({kind: 'ready', share: rec, me: mine});
    })();
    return () => {
      live = false;
    };
  }, [user.loggedIn, owner, share]);

  if (!user.loggedIn) {
    return (
      <Notice title='Someone shared their results with you'>
        <p className='pp-lede' style={{maxWidth: '54ch'}}>
          Log in to see their Personality+ results next to yours: where you are alike, where you may rub, and how to
          work with the difference.
        </p>
        <div className='pp-hero__actions' style={{marginTop: 8}}>
          <Link to='/login' className='pp-btn' onClick={() => setReturnPath(here)}>
            Log in to compare
          </Link>
          <Link to='/buy' className='pp-textlink' onClick={() => setReturnPath(here)}>
            New here? Take the test — {PRICE}
          </Link>
        </div>
      </Notice>
    );
  }

  switch (state.kind) {
    case 'loading':
      return (
        <div className='pp pp-wrap pp-pagehead' aria-busy='true'>
          <p className='pp-lede'>Loading your comparison…</p>
        </div>
      );
    case 'own':
      return (
        <Notice title='This is your own link'>
          <p className='pp-lede' style={{maxWidth: '54ch'}}>
            Send it to the person you want to compare with. When they open it and log in, they will see your results
            next to theirs.
          </p>
          <Link to='/results' className='pp-btn' style={{justifySelf: 'start'}}>
            Back to my results
          </Link>
        </Notice>
      );
    case 'missing':
      return (
        <Notice title='We couldn’t find that link'>
          <p className='pp-lede' style={{maxWidth: '54ch'}}>
            Check that the whole link was copied, or ask the person who sent it for a new one.
          </p>
        </Notice>
      );
    case 'unlinked':
      return (
        <Notice title='This link was unlinked'>
          <p className='pp-lede' style={{maxWidth: '54ch'}}>
            The person who shared it has turned it off, so their results are no longer shared here.
          </p>
        </Notice>
      );
    case 'no-results':
      return (
        <Notice title='Take your test first'>
          <p className='pp-lede' style={{maxWidth: '54ch'}}>
            To compare, we need your results too. Take the test, then open this link again.
          </p>
          <Link to='/test' className='pp-btn' style={{justifySelf: 'start'}}>
            Start my test
          </Link>
        </Notice>
      );
    case 'ready':
      return (
        <CompareView
          me={{name: 'You', percentiles: state.me.percentiles}}
          them={{name: state.share.name || 'Them', percentiles: state.share.percentiles}}
          relationship={state.share.relationship}
        />
      );
  }
};

export default Compare;
