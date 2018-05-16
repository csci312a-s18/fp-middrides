
const request = require('supertest');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const { MongoClient } = require('mongodb');
const { server, setDb } = require('./server');

// Increase timeout for first run when downloading mongo binaries
jest.setTimeout(60000);

let mongoServer;
let db;

const request1 = {
  name: 'Laurie Patton',
  passengers: '7',
  currentLocation: 'E Lot',
  destination: 'T Lot',
  active: true,
  isPickedUp: false,
  timestamp: '2015-11-19T22:57:32.639Z',
  _id: '2',
};

const shuttleLocation = {
  latitude: 44,
  longitude: -73,
  _id: '1',
};
const nextStop = {
  nextStop: 'E Lot',
  stop: 'T Lot',
  _id: '2',
};

beforeAll(() => {
  mongoServer = new MongodbMemoryServer();
  return mongoServer.getConnectionString().then(mongoURL => Promise.all([
    MongoClient.connect(mongoURL),
    mongoServer.getDbName(),
  ])).then(([connection, dbName]) => {
    db = connection.db(dbName);
    setDb(db);
  }).then(() => {
    db.collection('requests').createIndex(
      { name: 1 },
      { unique: true },
    );
    db.collection('shuttleLocation').createIndex(
      { name: 1 },
      { unique: true },
    );
  });
});

afterAll(() => {
  mongoServer.stop();
});

describe('MiddRides API', () => {
  afterEach(() => db.collection('requests').deleteMany({}));
  // Tests go here
  describe('Get requests', () => {
    beforeEach(() => db.collection('requests').insert(request1));
    test('GET /requests should return added requests', () => request(server).get('/requests')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([request1]));
  });

  describe('Get shuttleLocation', () => {
    beforeEach(() => db.collection('shuttleLocation').insert(shuttleLocation));
    test('GET /shuttleLocation should return added location', () => request(server).get('/shuttleLocation')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([shuttleLocation]));
  });
  describe('Get nextStop', () => {
    beforeEach(() => db.collection('nextStop').insert(nextStop));
    test('Get /nextStop should return added nextStop and stop', () => request(server).get('/nextStop')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect([nextStop]));
  });

  describe('Post requests', () => {
    test('Should create new request', () => request(server).post('/requests').send(request1)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toMatchObject(request1);
      }));
  });
});
