import React, { Component } from 'react';
// import Form from './components/Form';
import styled from 'styled-components';
import ContentArea from './components/ContentArea';
// import Form from './components/Form';

const MiddRidesTitle = styled.p`
 text-align: center;
 color: #000080;
 font-size: 2em;
`;

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID, MongoError } = require('mongodb'); // eslint-disable-line no-unused-vars

const app = express();

const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/requests', (request, response, next) => {
  db.collection('requests').find().toArray().then((documents) => { // eslint-disable-line no-unused-vars
    response.send(documents);
  }, next);
});

/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  render() {
    return (
      <div className="App">
        <MiddRidesTitle> MiddRides </MiddRidesTitle>
        <ContentArea />
      </div>
    );
  }
}

module.exports = {
  app,
  setDb: (newDb) => { db = newDb; }, // eslint-disable-line no-undef
};
