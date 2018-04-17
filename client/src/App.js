import React, { Component } from 'react';
// import Form from './components/Form';
import styled from 'styled-components';
import ContentArea from './components/ContentArea';
// import Form from './components/Form';

const MiddRidesTitle = styled.p`
 text-align: center;
 background-color: #000080;
 font-size: 2em;
 color: white;
`;

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

export default App;
