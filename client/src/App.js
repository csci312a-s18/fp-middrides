import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const MiddRidesTitle = styled.h1`
 text-align: center;

`
/* eslint-disable react/prefer-stateless-function */
class App extends Component {
  constructor() {
    super();
    this.state = {
      viewmode: 'UserStart',
    };
  }
  render() {
      if(this.state.viewmode === "UserStart"){
      return (
        <div className="App">
          <MiddRidesTitle> MIDDRIDES </MiddRidesTitle>
        </div>
        //Button
      );
      }
      else if(this.state.viewmode === "RequestRide"){
        return ("hello world");
        //show request form
      }
  }
}

export default App;
