
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
};

const request2 = {
  name: 'Michael Linderman',
  passengers: '7',
  currentLocation: 'T Lot',
  destination: 'E Lot',
  active: true,
  isPickedUp: true,
  timestamp: '2016-11-21T22:57:32.639Z',
};

const request3 = {
  name: 'Pete',
  passengers: '7',
  currentLocation: 'E Lot',
  destination: 'T Lot',
  active: false,
  isPickedUp: false,
  timestamp: '2016-11-20T22:57:32.639Z',
};
const newRequestCheck = {
   name: 'Lulu',
   passengers: '7',
   currentLocation: 'E Lot',
   destination: 'T Lot',
   active: true,
   isPickedUp: false,
   timestamp: '2016-11-19T22:57:32.639Z',
   extract:'',
};

const requestToJSON = function requestToJSON(localRequest) {
  return Object.assign({}, localRequest, {
    _id: localRequest._id, // eslint-disable-line no-underscore-dangle
  });
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
      { title: 1 },
      { unique: true },
    );
  });
});

afterAll(() => {
  mongoServer.stop();
});

describe('MiddRides API', () => {

  test('Test', () => {
    expect(request1).toEqual(request1);
  });

  /*beforeEach(() => Promise.all([
    db.collection('requests').insert(request1),
    // db.collection('requests').insert(request2),
    // db.collection('requests').insert(request3),
    // db.collection('requests').insert(newRequestCheck),
  ]));
  afterEach(() => db.collection('requests').deleteMany({}));*/
// Tests go here

  //describe('', () => {
    /*
    test('GET /requests should return all movies (mostly SuperTest)', () => {
       return request(server).get('/requests')
         .expect(200)
         .expect('Content-Type', /json/)
         .expect([requestToJSON(request1)]);
       });
*/
      /*test('Should update request', () => {
        const newRequest = Object.assign({}, request2, {
           name: 'Lulu',
           passengers: '7',
           currentLocation: 'E Lot',
           destination: 'T Lot',
           active: true,
           isPickedUp: false,
           timestamp: '2016-11-19T22:57:32.639Z',
         });
         const newRequestCheck = Object.assign({}, request2, {
            name: 'Lulu',
            passengers: '7',
            currentLocation: 'E Lot',
            destination: 'T Lot',
            active: true,
            isPickedUp: false,
            timestamp: '2016-11-19T22:57:32.639Z',
            extract:'',
          });
        return request(server).put(`/requests/${request2._id}`).send(newRequest)
          .expect(200)
          .expect(requestToJSON(newRequest));
      });*/
//  });

});
