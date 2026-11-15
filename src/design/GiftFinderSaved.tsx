import React, {useCallback, useEffect, useRef, useState} from 'react';
import GiftFinder from './GiftFinder';
import {GiftFinderSave} from '../constants/giftFinder';
import {GiftFinderStore} from '../utils/giftFinderStore';

/**
 * The Gift Finder with saving: loads where the person left off, then saves a moment after
 * each change (and right away if they leave the page), showing "Saving…" / "Saved".
 */

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const WAIT_MS = 1200;

const GiftFinderSaved: React.FC<{
  store: GiftFinderStore;
  percentiles: Record<string, number>;
  name?: string;
  sample?: boolean;
  saveNote: string;
}> = ({store, percentiles, name, sample, saveNote}) => {
  const [initial, setInitial] = useState<GiftFinderSave | null | undefined>(undefined);
  const [state, setState] = useState<SaveState>('idle');
  const pending = useRef<GiftFinderSave | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    store.load().then((s) => alive && setInitial(s));
    return () => {
      alive = false;
    };
  }, [store]);

  const flush = useCallback(async () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    const next = pending.current;
    if (!next) return;
    pending.current = null;
    setState('saving');
    try {
      await store.save(next);
      // Only call it saved if nothing new came in while this was saving.
      setState(pending.current ? 'saving' : 'saved');
    } catch (e) {
      console.error(e);
      pending.current = pending.current ?? next;
      setState('error');
    }
  }, [store]);

  const onChange = useCallback(
    (s: GiftFinderSave) => {
      pending.current = s;
      setState('saving');
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, WAIT_MS);
    },
    [flush],
  );

  // Save straight away when the person leaves or hides the page.
  useEffect(() => {
    const now = () => {
      if (pending.current) flush();
    };
    const onHide = () => document.visibilityState === 'hidden' && now();
    window.addEventListener('pagehide', now);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', now);
      document.removeEventListener('visibilitychange', onHide);
      now();
    };
  }, [flush]);

  if (initial === undefined) {
    return (
      <div className='pp pp-wrap pp-pagehead' aria-busy='true'>
        <p className='pp-lede'>Opening your Gift Finder…</p>
      </div>
    );
  }

  const status =
    state === 'error' ? (
      <span className='pp-gf-saved is-error' role='alert'>
        Couldn’t save. Check your connection.{' '}
        <button type='button' className='pp-textlink' onClick={flush}>
          Try again
        </button>
      </span>
    ) : state === 'idle' ? null : (
      <span className='pp-gf-saved' aria-live='polite'>
        {state === 'saving' ? 'Saving…' : 'Saved'}
      </span>
    );

  return (
    <GiftFinder
      percentiles={percentiles}
      name={name}
      sample={sample}
      initial={initial ?? undefined}
      onChange={onChange}
      status={status}
      saveNote={saveNote}
    />
  );
};

export default GiftFinderSaved;
