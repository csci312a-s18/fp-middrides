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
  db.collection('requests').find().toArray().then((documents) => { // eslint-disable-line no-unused-vars
    response.send(documents);
  }, next);
});
<<<<<<< HEAD

server.post('/requests', (request, response, next) => {
  const newRequest = Object.assign({ extract: '' }, request.body);
  db.collection('requests').insertOne(newRequest).then((result) => {
    response.send(result.ops[0]);
  }, next);
});

server.put('/requests/:id', (request, response, next) => {
  const updatedRequest = Object.assign(
    { extract: '' },
    request.body,
    { _id: ObjectID.createFromHexString(request.params.id) },
  );
  db.collection('request')
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
  db.collection('requests')
    .deleteOne({ _id: ObjectID.createFromHexString(request.params.id) })
    .then(() => {
      response.sendStatus(200);
    }, next);
});
=======
>>>>>>> 2148c1b5d0cc1f13a04850f6a0f10bbcd2f2efe8

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

// TODO: Add any middleware here

// TODO: Add your routes here

module.exports = {
  server,
  setDb: (newDb) => { db = newDb; }, // eslint-disable-line no-undef
};
