# Project MiddRides Top-level

This repository combines the client and server into a single repository that can be co-developed, tested and ultimately deployed to Heroku or basin.cs.middlebury.edu.

The client was created with [create-react-app](https://github.com/facebookincubator/create-react-app) (CRA) and the server is a separate Node.js application. The client-server integration is based on this [tutorial](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/) and [repository](https://github.com/fullstackreact/food-lookup-demo). This repository will be referred to as the "top-level" to distinguish it from the client and server.

## Installing Dependencies

The skeleton is structured as three separate packages and so the dependencies need to be installed independently in each of the top-level, the client and the server, i.e.:

```
npm install
npm install --prefix client
npm install --prefix server
```

## Running the Application

The combined application, client and server, can be run with `npm start` in the top-level directory. `npm start` launches the CRA development server on http://localhost:3000 and the backend server on http://localhost:3001. By setting the `proxy` field in the client `package.json`, the client development server will proxy any unrecognized requests to the server.

## Testing

The client application can be independently tested as described in the [CRA documentation](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests), i.e.:

```
npm test --prefix client
```

The server can be similarly independently tested:

```
npm test --prefix server
```

## Linting

Both the client and server can be independently linted via:

```
npm run lint --prefix client
```

and

```
npm run lint --prefix server
```

## Continuous Integration

The skeleton is setup for CI with Travis-CI. Travis will run build the client and test and lint both the client and the server.

## Deploying to Heroku

The Film Explorer can be deployed to [Heroku](heroku.com) using the approach demonstrated in this [repository](https://github.com/mars/heroku-cra-node). The key additions to the top-level `package.json` file to enable Heroku deployment:

* Specify the node version in the `engines` field
* Add a `heroku-postbuild` script field that will install dependencies for the client and server and create the production build of the client application.
* Specify that `node_modules` should be cached to optimize build time

In addition a `Procfile` was added in the top-level package to start the server.

Assuming that you have a Heroku account, have installed the [Heroku command line tools](https://devcenter.heroku.com/articles/heroku-cli) and committed any changes to the application, to deploy to Heroku:

1. Create the Heroku app, e.g.:

    ```
    heroku apps:create
    ```

1. Push to Heroku

    ```
    git push heroku master
    ```

Depending on how you implement your backend, you will likely need create "addons" for your database, etc. and migrate then seed your database before you deploy.

## Deploying to Basin

Your project can be deployed to basin.cs.middlebury.edu (where it is typically run within `screen` on an unused port). As with Heroku you will like need to create and seed your database before you deploy.

1. Build production assets for the client application (from the top-level directory):

    ```
    npm run heroku-postbuild
    ```

1. Start the server from the top-level directory (note you will need to pick an unused port):

  	```
  	NODE_ENV=production PORT=5042 npm run start --prefix server
  	```
