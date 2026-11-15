import {Auth} from 'aws-amplify';

/**
 * Who can open the Gift Finder, and how it is bought.
 *
 * Buying: a Stripe Payment Link (set in Amplify as REACT_APP_GIFT_FINDER_LINK). The buyer's account
 * ID rides along as `client_reference_id`, so the payment program knows whose account to unlock.
 * Until that setting exists, the Gift Finder stays admins-only and nobody is offered it.
 *
 * Owning: being in the Cognito group "gift-finder" (added by the payment program), or "admins".
 */
export const GIFT_FINDER_GROUP = 'gift-finder';
export const GIFT_FINDER_PRICE = '$9.99';
export const GIFT_FINDER_LINK = process.env.REACT_APP_GIFT_FINDER_LINK ?? '';
export const GIFT_FINDER_ON_SALE = /^https:\/\/(buy|checkout)\.stripe\.com\//.test(GIFT_FINDER_LINK);

export const groupsOf = (cognitoUser: any): string[] =>
  cognitoUser?.signInUserSession?.accessToken?.payload?.['cognito:groups'] ?? [];

/** The Payment Link for this account. The ID is Cognito's random user ID, not an email. */
export async function checkoutUrl(): Promise<string> {
  const user = await Auth.currentAuthenticatedUser();
  const sub: string = user.attributes?.sub ?? '';
  const url = new URL(GIFT_FINDER_LINK);
  if (sub) url.searchParams.set('client_reference_id', sub);
  return url.toString();
}

/**
 * Group membership lives in the login token, which is only refreshed now and then. Right after
 * buying, ask Cognito for a fresh token so the new group shows up without logging out.
 */
export async function freshGroups(): Promise<string[]> {
  const user = await Auth.currentAuthenticatedUser();
  const session = await Auth.currentSession();
  await new Promise((resolve, reject) =>
    user.refreshSession(session.getRefreshToken(), (err: unknown, s: unknown) => (err ? reject(err) : resolve(s))),
  );
  const again = await Auth.currentAuthenticatedUser({bypassCache: true});
  return groupsOf(again);
}
