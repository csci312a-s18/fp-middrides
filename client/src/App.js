import React, { Component } from 'react';
// import Form from './components/Form';
import styled from 'styled-components';
import ContentArea from './components/ContentArea';
// import Form from './components/Form';
import QueueView from './components/QueueView';

const MiddRidesTitle = styled.p`
 text-align: center;
 color: #000080;
 font-size: 2em;
`;

/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  render() {
    return (
      <div className="App">
        <MiddRidesTitle> MiddRides </MiddRidesTitle>
        <QueueView />
      </div>
    );
  }
}

export default App;
