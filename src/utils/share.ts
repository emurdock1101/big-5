import {Auth} from 'aws-amplify';
import {Storage} from '@aws-amplify/storage';

/**
 * Sharing results with someone to compare.
 *
 * A share is a small file in the owner's *protected* storage: any signed-in user can read it
 * if they have the link, but only the owner can change it. It holds first name, comparison
 * group and the 15 percentiles; no email. Unlinking overwrites it as revoked, so the link stops
 * working. The owner's list of links lives in *private* storage, readable only by them.
 *
 * Link: /compare/{ownerIdentityId}/{shareId}
 */

export type Relationship = 'Spouse' | 'Friend' | 'Family' | 'Other';
export const RELATIONSHIPS: Relationship[] = ['Spouse', 'Friend', 'Family', 'Other'];

export interface ShareRecord {
  v: 1;
  name: string;
  gender: string;
  relationship: Relationship;
  percentiles: Record<string, number>;
  created: string;
  revoked?: boolean;
}

export interface ShareListItem {
  id: string;
  relationship: Relationship;
  /** Who it's for; only in the owner's private list. */
  label: string;
  created: string;
  revoked?: boolean;
}

const LIST_KEY = 'shares/index.json';
const shareKey = (id: string) => `shares/${id}.json`;

const configure = () =>
  Storage.configure({
    bucket: process.env.REACT_APP_BUCKET_NAME,
    region: 'us-east-1',
  });

/** A random, unguessable id for a share link. */
export function newShareId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const shareUrl = (ownerId: string, id: string, origin = window.location.origin) =>
  `${origin}/compare/${encodeURIComponent(ownerId)}/${id}`;

export async function myIdentityId(): Promise<string> {
  const creds = await Auth.currentCredentials();
  return creds.identityId;
}

async function readJson<T>(key: string, options: Record<string, unknown>): Promise<T | null> {
  configure();
  try {
    const url = (await Storage.get(key, options)) as string;
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function writeJson(key: string, data: unknown, level: 'protected' | 'private') {
  configure();
  await Storage.put(key, JSON.stringify(data), {level, contentType: 'application/json'});
}

export async function listShares(): Promise<ShareListItem[]> {
  return (await readJson<ShareListItem[]>(LIST_KEY, {level: 'private'})) ?? [];
}

export async function createShare(input: {
  name: string;
  gender: string;
  percentiles: Record<string, number>;
  relationship: Relationship;
  label: string;
}): Promise<{item: ShareListItem; url: string}> {
  const id = newShareId();
  const created = new Date().toISOString();
  const record: ShareRecord = {
    v: 1,
    name: input.name,
    gender: input.gender,
    relationship: input.relationship,
    percentiles: input.percentiles,
    created,
  };
  await writeJson(shareKey(id), record, 'protected');
  const item: ShareListItem = {id, relationship: input.relationship, label: input.label.trim(), created};
  const list = await listShares();
  await writeJson(LIST_KEY, [item, ...list], 'private');
  return {item, url: shareUrl(await myIdentityId(), id)};
}

/** Stop a link working: overwrite the shared file without the scores, and mark it in the list. */
export async function unlinkShare(id: string): Promise<ShareListItem[]> {
  const list = await listShares();
  const item = list.find((x) => x.id === id);
  await writeJson(
    shareKey(id),
    {
      v: 1,
      revoked: true,
      name: '',
      gender: '',
      relationship: item?.relationship ?? 'Other',
      percentiles: {},
      created: item?.created ?? '',
    },
    'protected',
  );
  const next = list.map((x) => (x.id === id ? {...x, revoked: true} : x));
  await writeJson(LIST_KEY, next, 'private');
  return next;
}

/** Load someone else's share. Null when it doesn't exist; a record with revoked = true when unlinked. */
export async function loadShare(ownerId: string, id: string): Promise<ShareRecord | null> {
  if (!/^[0-9a-f]{32}$/.test(id)) return null;
  return readJson<ShareRecord>(shareKey(id), {level: 'protected', identityId: ownerId});
}

/** A comparison someone shared with you and you have opened, kept so you can come back to it. */
export interface ReceivedItem {
  owner: string;
  id: string;
  name: string;
  relationship: Relationship;
  opened: string;
  revoked?: boolean;
}

const RECEIVED_KEY = 'shares/received.json';

export async function listReceived(): Promise<ReceivedItem[]> {
  return (await readJson<ReceivedItem[]>(RECEIVED_KEY, {level: 'private'})) ?? [];
}

/** Remember (or refresh) a comparison in the viewer's private list. */
export async function rememberReceived(item: ReceivedItem): Promise<void> {
  const list = await listReceived();
  const rest = list.filter((x) => !(x.owner === item.owner && x.id === item.id));
  await writeJson(RECEIVED_KEY, [item, ...rest], 'private');
}

/** Mark a remembered comparison as unlinked by its owner. */
export async function markReceivedUnlinked(owner: string, id: string): Promise<void> {
  const list = await listReceived();
  if (!list.some((x) => x.owner === owner && x.id === id && !x.revoked)) return;
  await writeJson(
    RECEIVED_KEY,
    list.map((x) => (x.owner === owner && x.id === id ? {...x, revoked: true} : x)),
    'private',
  );
}

export async function forgetReceived(owner: string, id: string): Promise<ReceivedItem[]> {
  const next = (await listReceived()).filter((x) => !(x.owner === owner && x.id === id));
  await writeJson(RECEIVED_KEY, next, 'private');
  return next;
}

export const comparePath = (owner: string, id: string) => `/compare/${encodeURIComponent(owner)}/${id}`;

/** The signed-in person's own saved results. */
export async function loadMyResults(): Promise<{
  name: string;
  gender: string;
  percentiles: Record<string, number>;
} | null> {
  configure();
  try {
    const user = await Auth.currentAuthenticatedUser();
    const email: string = user.attributes?.email ?? '';
    const sub: string = user.attributes?.sub ?? '';
    const url = (await Storage.get(`${email}-${sub}/${email}-results`)) as string;
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.percentiles) return null;
    return {name: data.name ?? '', gender: data.gender ?? '', percentiles: data.percentiles};
  } catch {
    return null;
  }
}

/** Where to send someone after they log in (e.g. back to a compare link). */
const RETURN_KEY = 'pp-return';
export function setReturnPath(path: string) {
  try {
    localStorage.setItem(RETURN_KEY, path);
  } catch {
    /* storage unavailable: they can open the link again */
  }
}
export function takeReturnPath(): string | null {
  try {
    const v = localStorage.getItem(RETURN_KEY);
    localStorage.removeItem(RETURN_KEY);
    return v && v.startsWith('/compare/') ? v : null;
  } catch {
    return null;
  }
}
