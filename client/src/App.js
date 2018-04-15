import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

module.exports = {
  app,
  setDb: (newDb) => { db = newDb; }, // eslint-disable-line no-undef
};
