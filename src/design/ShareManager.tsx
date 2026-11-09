import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
  comparePath,
  createShare,
  forgetReceived,
  listReceived,
  ReceivedItem,
  listShares,
  myIdentityId,
  Relationship,
  RELATIONSHIPS,
  ShareListItem,
  shareUrl,
  unlinkShare,
} from '../utils/share';

interface ShareManagerProps {
  name: string;
  gender: string;
  percentiles: Record<string, number>;
  /** Preview page: show the panel without touching storage. */
  demo?: boolean;
}

const when = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : '';

/** "Compare with someone": make a private link, copy it, and unlink it later. */
const ShareManager: React.FC<ShareManagerProps> = ({name, gender, percentiles, demo}) => {
  const [list, setList] = useState<ShareListItem[]>([]);
  const [received, setReceived] = useState<ReceivedItem[]>(
    demo ? [{owner: 'demo', id: 'demo', name: 'Sam', relationship: 'Spouse', opened: new Date().toISOString()}] : [],
  );
  const [ownerId, setOwnerId] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('Spouse');
  const [label, setLabel] = useState('');
  const [shownAs, setShownAs] = useState(name);
  const [fresh, setFresh] = useState<{id: string; url: string} | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (demo) return;
    listShares().then(setList);
    listReceived().then(setReceived);
    myIdentityId()
      .then(setOwnerId)
      .catch(() => setOwnerId(''));
  }, [demo]);

  const make = async () => {
    setError('');
    if (!shownAs.trim()) return setError('Add the name they should see.');
    setBusy(true);
    try {
      if (demo) {
        const item = {id: 'demo', relationship, label, created: new Date().toISOString()};
        setList((l) => [item, ...l]);
        setFresh({id: 'demo', url: `${window.location.origin}/compare-preview`});
      } else {
        const {item, url} = await createShare({name: shownAs.trim(), gender, percentiles, relationship, label});
        setList((l) => [item, ...l]);
        setFresh({id: item.id, url});
      }
      setLabel('');
    } catch {
      setError('We couldn’t make the link. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async (id: string, url: string) => {
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({title: 'Compare our Personality+ results', url});
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(id);
      window.setTimeout(() => setCopied(''), 2500);
    } catch {
      /* the person cancelled the share sheet */
    }
  };

  const unlink = async (item: ShareListItem) => {
    const who = item.label || `your ${item.relationship.toLowerCase()}`;
    if (!window.confirm(`Unlink the link you sent to ${who}? It will stop working right away.`)) return;
    if (demo) {
      setList((l) => l.map((x) => (x.id === item.id ? {...x, revoked: true} : x)));
      return;
    }
    try {
      setList(await unlinkShare(item.id));
      if (fresh?.id === item.id) setFresh(null);
    } catch {
      setError('We couldn’t unlink it. Check your connection and try again.');
    }
  };

  const urlFor = (id: string) => (demo ? `${window.location.origin}/compare-preview` : shareUrl(ownerId, id));

  const forget = async (item: ReceivedItem) => {
    if (!window.confirm(`Remove your comparison with ${item.name} from this list?`)) return;
    if (demo) return setReceived((r) => r.filter((x) => x !== item));
    try {
      setReceived(await forgetReceived(item.owner, item.id));
    } catch {
      setError('We couldn’t remove it. Check your connection and try again.');
    }
  };

  return (
    <section className='pp-walk__aspect pp-share' aria-labelledby='pp-share-h'>
      {received.length > 0 && (
        <div className='pp-share__list pp-share__list--received'>
          <h3 className='pp-display pp-h3'>Your comparisons</h3>
          <p style={{margin: '8px 0 0'}}>People who shared their results with you. Open one to see you side by side.</p>
          <ul>
            {received.map((item) => (
              <li key={item.owner + item.id} className={item.revoked ? 'is-off' : undefined}>
                <span className='pp-share__who'>
                  <b>You and {item.name}</b>
                  <span>
                    {item.relationship} · {item.revoked ? 'Unlinked by ' + item.name : 'Opened ' + when(item.opened)}
                  </span>
                </span>
                <span className='pp-share__actions'>
                  {!item.revoked && (
                    <Link className='pp-textlink' to={demo ? '/compare-preview' : comparePath(item.owner, item.id)}>
                      Open
                    </Link>
                  )}
                  <button type='button' className='pp-textlink' onClick={() => forget(item)}>
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 id='pp-share-h' className='pp-display pp-h3'>
        Compare with someone
      </h3>
      <p style={{margin: 0}}>
        Make a private link for your spouse, a friend or family. When they open it and log in, they will see your
        results next to theirs: where you are alike and where you may rub. You can unlink it anytime.
      </p>

      <fieldset className='pp-share__rel'>
        <legend>Who is it for?</legend>
        <div className='pp-share__chips'>
          {RELATIONSHIPS.map((r) => (
            <label key={r} className='pp-share__chip'>
              <input
                type='radio'
                name='pp-share-rel'
                value={r}
                checked={relationship === r}
                onChange={() => setRelationship(r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className='pp-share__fields'>
        <label className='pp-share__field'>
          <span>Their name (only you see this)</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder='Optional' maxLength={40} />
        </label>
        <label className='pp-share__field'>
          <span>Your name, as they will see it</span>
          <input value={shownAs} onChange={(e) => setShownAs(e.target.value)} maxLength={40} />
        </label>
      </div>
      {error && (
        <p className='pp-share__error' role='alert'>
          {error}
        </p>
      )}
      <button type='button' className='pp-btn' onClick={make} disabled={busy} style={{justifySelf: 'start'}}>
        {busy ? 'Making your link…' : 'Make a link'}
      </button>

      {fresh && (
        <div className='pp-share__fresh' role='status'>
          <p style={{margin: 0}}>
            <b>Your link is ready.</b> Send it however you like. Anyone who has this link and an account can see your
            scores until you unlink it.
          </p>
          <div className='pp-share__url'>
            <input readOnly value={fresh.url} aria-label='Your share link' onFocus={(e) => e.target.select()} />
            <button type='button' className='pp-btn' onClick={() => copy(fresh.id, fresh.url)}>
              {copied === fresh.id ? 'Copied' : 'Copy link'}
            </button>
          </div>
        </div>
      )}

      {list.length > 0 && (
        <div className='pp-share__list'>
          <p className='pp-split__kicker'>Your links</p>
          <ul>
            {list.map((item) => (
              <li key={item.id} className={item.revoked ? 'is-off' : undefined}>
                <span className='pp-share__who'>
                  <b>{item.label || item.relationship}</b>
                  <span>
                    {item.label ? `${item.relationship} · ` : ''}
                    {when(item.created)}
                    {item.revoked ? ' · Unlinked' : ''}
                  </span>
                </span>
                {!item.revoked && (
                  <span className='pp-share__actions'>
                    <button type='button' className='pp-textlink' onClick={() => copy(item.id, urlFor(item.id))}>
                      {copied === item.id ? 'Copied' : 'Copy'}
                    </button>
                    <button type='button' className='pp-textlink' onClick={() => unlink(item)}>
                      Unlink
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ShareManager;
