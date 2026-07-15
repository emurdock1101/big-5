Personality+ is a personality assessment based on the Big 5 Aspects personality model.

Users can learn about how their main personality traits compare to the population at large and discover how their specific personality can affect their day-to-day behavior.

First time setting up:

1. "npm install"
2. "npm install -g @aws-amplify/cli"
3. ensure you have the right AWS profile setup
4. "amplify pull --appId d3fk1q0jjmkmz0 --envName dev" or "amplify pull" to pull backend changes

To run:

1. "npm start" to run frontend locally on port 3000

## Admin Access

Admin features are protected via Cognito group membership. To grant admin access to a user:

1. AWS Console → Cognito → User Pools
2. Select the Personality+ User Pool
3. Go to **Groups** → create an `admins` group (if it doesn't exist yet)
4. Add the user to the `admins` group
