import {groupsOf} from './giftFinderAccess';

test('groups are read from the login token, and a missing token means no groups', () => {
  expect(groupsOf({signInUserSession: {accessToken: {payload: {'cognito:groups': ['gift-finder']}}}})).toEqual([
    'gift-finder',
  ]);
  expect(groupsOf({})).toEqual([]);
  expect(groupsOf(undefined)).toEqual([]);
});
