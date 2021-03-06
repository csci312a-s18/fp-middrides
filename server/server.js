/* eslint-disable no-underscore-dangle */
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID, MongoError } = require('mongodb'); // eslint-disable-line no-unused-vars

const server = express();

const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
};


server.use(cors(corsOptions));
server.use(bodyParser.json());

server.get('/requests', (request, response, next) => {
  const query = { active: true };
  db.collection('requests').find(query).toArray().then((documents) => { // eslint-disable-line no-undef
    response.send(documents);
  }, next);
});

server.post('/requests', (request, response, next) => {
  const newRequest = Object.assign(request.body);
  db.collection('requests').insertOne(newRequest).then((result) => { // eslint-disable-line no-undef
    response.send(result.ops[0]);
  }, next);
});

server.put('/requests/:id', (request, response, next) => {
  const updatedRequest = Object.assign(
    request.body,
    { _id: ObjectID.createFromHexString(request.params.id) },
  );
  db.collection('requests') // eslint-disable-line no-undef
    .findOneAndUpdate(
      { _id: updatedRequest._id },
      { $set: updatedRequest },
      { returnOriginal: false },
    )
    .then((result) => {
      response.send(result.value);
    }, next);
});

server.delete('/requests/:id', (request, response, next) => {
  db.collection('requests') // eslint-disable-line no-undef
    .deleteOne({ _id: ObjectID.createFromHexString(request.params.id) })
    .then(() => {
      response.sendStatus(200);
    }, next);
});


server.put('/shuttleLocation/:id', (request, response, next) => {
  const updatedLocation = Object.assign(
    request.body,
    { _id: ObjectID.createFromHexString(request.params.id) },
  );
  db.collection('shuttleLocation') // eslint-disable-line no-undef
    .findOneAndUpdate(
      { _id: updatedLocation._id },
      { $set: updatedLocation },
      { returnOriginal: false },
    )
    .then((result) => {
      response.send(result.value);
    }, next);
});

server.put('/nextStop/:id', (request, response, next) => {
  const updatedStop = Object.assign(
    request.body,
    { _id: ObjectID.createFromHexString(request.params.id) },
  );
  db.collection('nextStop') // eslint-disable-line no-undef
    .findOneAndUpdate(
      { _id: updatedStop._id },
      { $set: updatedStop },
      { returnOriginal: false },
    )
    .then((result) => {
      response.send(result.value);
    }, next);
});

server.get('/shuttleLocation', (request, response, next) => {
  db.collection('shuttleLocation').find().toArray().then((documents) => { // eslint-disable-line no-undef
    response.send(documents);
  }, next);
});

server.get('/nextStop', (request, response, next) => {
  db.collection('nextStop').find().toArray().then((documents) => { // eslint-disable-line no-undef
    response.send(documents);
  }, next);
});

server.get('/dispatcherExists', (request, response, next) => {
  db.collection('dispatcherExists').find().toArray().then((documents) => { // eslint-disable-line no-undef
    response.send(documents);
  }, next);
});

server.get('/dispatcherPassword', (request, response, next) => {
  db.collection('dispatcherPassword').find().toArray().then((documents) => { // eslint-disable-line no-undef
    response.send(documents);
  }, next);
});

server.put('/dispatcherExists/:id', (request, response, next) => {
  const updatedState = Object.assign(
    request.body,
    { _id: ObjectID.createFromHexString(request.params.id) },
  );
  db.collection('dispatcherExists') // eslint-disable-line no-undef
    .findOneAndUpdate(
      { _id: updatedState._id },
      { $set: updatedState },
      { returnOriginal: false },
    )
    .then((result) => {
      response.send(result.value);
    }, next);
});

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  // Resolve client build directory as absolute path to avoid errors in express
  const path = require('path'); // eslint-disable-line global-require
  const buildPath = path.resolve(__dirname, '../client/build');

  server.use(express.static(buildPath));

  // Serve the HTML file included in the CRA client
  server.get('/', (request, response) => {
    response.sendFile(path.join(buildPath, 'index.html'));
  });
}

module.exports = {
  server,
  setDb: (newDb) => { db = newDb; }, // eslint-disable-line no-undef
};
