import React, { Component } from 'react';
import styled from 'styled-components';
import ContentArea from './components/ContentArea';
import Form from './components/Form';

const MiddRidesTitle = styled.h1`
 text-align: center;
`;

/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  render() {
    return (
      <div className="App">
        <MiddRidesTitle> MIDDRIDES </MiddRidesTitle>
        <ContentArea />
      </div>
    );
  }
}

export default App;
