# Project Skeleton Server

## Running

Launch server with `npm run start`. By default the application is available at <http://localhost:3001>.

## Setup

Run `npm install` to install the dependencies.

## Development

### Testing with Jest

The server is configured for testing with the Jest test runner. Tests can be run with:

```
npm test
```

### Linting with ESLint

The server is configured with the [AirBnB ESLint rules](https://github.com/airbnb/javascript). You can run the linter with `npm run lint` or `npx eslint .`. Thee rules were installed with:

```
npx install-peerdeps --dev eslint-config-airbnb-base
```

and `.eslintrc.json` configured with:

```
{
  "extends": "airbnb-base"
}
```

The linter can be run with `npx eslint .` (or via `npm run lint`). Include the `--fix` option to `eslint` to automatically fix many formatting errors.
