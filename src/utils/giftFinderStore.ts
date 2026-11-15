import {Storage} from '@aws-amplify/storage';
import {cleanSave, GiftFinderSave} from '../constants/giftFinder';

/**
 * Where a person's Gift Finder progress is kept.
 *
 * The real page uses the account's *private* storage: only the signed-in person can read or
 * change it (the same level the compare feature uses for its list of links). Their written
 * reflections about gifts and blind spots never sit anywhere public.
 *
 * The development preview uses the browser tab instead, so it can be tried without logging in.
 */
export interface GiftFinderStore {
  load(): Promise<GiftFinderSave | null>;
  save(state: GiftFinderSave): Promise<void>;
}

export const PROGRESS_KEY = 'gift-finder/progress.json';

const configure = () =>
  Storage.configure({
    bucket: process.env.REACT_APP_BUCKET_NAME,
    region: 'us-east-1',
  });

export const privateStore: GiftFinderStore = {
  async load() {
    configure();
    try {
      const url = (await Storage.get(PROGRESS_KEY, {level: 'private'})) as string;
      const res = await fetch(url, {cache: 'no-store'});
      // No file yet (first visit) is not an error: start fresh.
      if (!res.ok) return null;
      return cleanSave(await res.json());
    } catch {
      return null;
    }
  },
  async save(state) {
    configure();
    await Storage.put(PROGRESS_KEY, JSON.stringify({...state, updated: new Date().toISOString()}), {
      level: 'private',
      contentType: 'application/json',
    });
  },
};

const TAB_KEY = 'pp-gift-finder-sample';

export const tabStore: GiftFinderStore = {
  async load() {
    try {
      const raw = sessionStorage.getItem(TAB_KEY);
      return raw ? cleanSave(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  },
  async save(state) {
    try {
      sessionStorage.setItem(TAB_KEY, JSON.stringify({...state, updated: new Date().toISOString()}));
    } catch {
      // Private browsing or a full tab: the sample just won't resume.
    }
  },
};
