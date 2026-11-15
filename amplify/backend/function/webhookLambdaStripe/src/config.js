/**
 * Which Stripe products this program acts on. Product IDs are labels, not secrets.
 *
 * - assessment: buying the test creates the login and emails the temporary password.
 * - giftFinder: buying the Gift Finder adds the buyer's existing account to the Gift Finder group.
 * Anything else (for example the session products) is ignored here.
 *
 * Live and test (Stripe sandbox) products have different IDs, so each mode has its own list.
 * Add the Gift Finder IDs once the product exists in Stripe.
 */
module.exports = {
  GIFT_FINDER_GROUP: 'gift-finder',
  products: {
    live: {
      assessment: ['prod_Mi7RMFm1TFNwal'],
      giftFinder: ['prod_VdSR932D03hXwM'],
    },
    test: {
      assessment: ['prod_Mi8T3OqROL6R3p'],
      giftFinder: ['prod_VdMttZQByhp0OX'],
    },
  },
};
