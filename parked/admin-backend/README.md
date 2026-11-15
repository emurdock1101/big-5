# Parked: the Admin backend (Elliot, July 2026)

Moved out of `amplify/backend/` on Nov 15, 2026 so the Amplify build can deploy the backend again.

- `adminResultsLambda/` is the function that lists all users and their results for the `/admin` page.
- It was never deployed, and its API (`adminApi`) was listed in `backend-config.json` without the
  API's own folder, which would have made every backend deploy fail.
- To bring it back: move the folder back to `amplify/backend/function/`, re-add the function and its
  API with the Amplify CLI (`amplify add api`), review who can call it (it exposes every user's
  results), then deploy and set `REACT_APP_ADMIN_API_URL` in Amplify.
