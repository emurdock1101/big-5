jest.mock('aws-amplify', () => ({Auth: {}}));
jest.mock('@aws-amplify/storage', () => ({Storage: {}}));

import {webcrypto} from 'crypto';
import {newShareId, shareUrl, setReturnPath, takeReturnPath} from './share';

// The test browser has no crypto.getRandomValues; real browsers all do.
if (!(globalThis as any).crypto?.getRandomValues) {
  Object.defineProperty(globalThis, 'crypto', {value: webcrypto, configurable: true});
}

describe('share links', () => {
  it('makes long random ids', () => {
    const a = newShareId();
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(newShareId()).not.toBe(a);
  });

  it('builds the compare link', () => {
    expect(shareUrl('us-east-1:abc', 'f'.repeat(32), 'https://x.com')).toBe(
      `https://x.com/compare/us-east-1%3Aabc/${'f'.repeat(32)}`,
    );
  });

  it('sends people back to a compare link after logging in, once', () => {
    setReturnPath('/compare/a/b');
    expect(takeReturnPath()).toBe('/compare/a/b');
    expect(takeReturnPath()).toBeNull();
  });

  it('ignores return paths that are not compare links', () => {
    setReturnPath('https://evil.example');
    expect(takeReturnPath()).toBeNull();
  });
});
