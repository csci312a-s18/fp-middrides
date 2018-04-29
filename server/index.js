/* eslint-disable no-console */
const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');
const { server, setDb } = require('./server');

<<<<<<< HEAD
const mongoURL = process.env.MONGODB_URI || 'mongodb://heroku_b4q7q9zw:v258t3bsmg9o77vm4jq1e6peal@ds247699.mlab.com:47699/heroku_b4q7q9zw';
=======
const mongoURL = 'mongodb://middrides:middridesapp1@ds247699.mlab.com:47699/heroku_b4q7q9zw';
>>>>>>> Added new functionality in the server to keep a latitude and logitude field for the location of the shuttle. Added functions to update the location and pull the location. Build is currently failing due to internal server issues.

MongoClient.connect(mongoURL, (err, database) => {
  if (err) {
    console.error(err);
  } else {
    // Don't start server unless we have successfully connect to the database
    const db = database.db(url.parse(mongoURL).pathname.slice(1)); // Extract database name
    setDb(db);

    // We create the server explicitly (instead of using app.listen()) to
    // provide an example of how we would create a https server
    const middRidesServer = http.createServer(server).listen(process.env.PORT || 3001);
    console.log('Listening on port %d', middRidesServer.address().port);
  }
});
