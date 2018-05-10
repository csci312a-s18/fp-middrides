import React, { Component } from 'react';
// import Form from './components/Form';
import logo from './logo.png';
import ContentArea from './components/ContentArea';
// import Form from './components/Form';


/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  render() {
    return (
      <div className="App">
        <img src={logo} className="center" width="200" alt="logo" />
        <br />
        <ContentArea />
      </div>
    );
  }
}

export default App;
