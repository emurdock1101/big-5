// A stand-in for AWS storage: files live in memory, keyed by level + path.
const files: Record<string, string> = {};
const keyOf = (key: string, opts: any = {}) => `${opts.level ?? 'public'}/${opts.identityId ?? 'me'}/${key}`;

jest.mock('aws-amplify', () => ({Auth: {currentCredentials: async () => ({identityId: 'me'})}}));
jest.mock('@aws-amplify/storage', () => ({
  Storage: {
    configure: () => undefined,
    get: async (key: string, opts: any) => `mem://${keyOf(key, opts)}`,
    put: async (key: string, body: string, opts: any) => {
      files[keyOf(key, opts)] = body;
    },
  },
}));

import {forgetReceived, listReceived, markReceivedUnlinked, rememberReceived} from './share';

beforeEach(() => {
  for (const k of Object.keys(files)) delete files[k];
  (global as any).fetch = async (url: string) => {
    const body = files[url.replace('mem://', '')];
    return {ok: body !== undefined, json: async () => JSON.parse(body)};
  };
});

const sam = {owner: 'us-east-1:sam', id: 'a'.repeat(32), name: 'Sam', relationship: 'Spouse' as const, opened: '2026-11-09'};

describe('saved comparisons', () => {
  it('starts empty', async () => {
    expect(await listReceived()).toEqual([]);
  });

  it('remembers a comparison once, refreshing it when opened again', async () => {
    await rememberReceived(sam);
    await rememberReceived({...sam, opened: '2026-11-10'});
    const list = await listReceived();
    expect(list).toHaveLength(1);
    expect(list[0].opened).toBe('2026-11-10');
  });

  it('keeps it in private storage, readable only by the viewer', async () => {
    await rememberReceived(sam);
    expect(Object.keys(files)).toEqual(['private/me/shares/received.json']);
  });

  it('marks it unlinked when the owner turns the link off', async () => {
    await rememberReceived(sam);
    await markReceivedUnlinked(sam.owner, sam.id);
    expect((await listReceived())[0].revoked).toBe(true);
  });

  it('removes it from the list', async () => {
    await rememberReceived(sam);
    expect(await forgetReceived(sam.owner, sam.id)).toEqual([]);
  });
});
