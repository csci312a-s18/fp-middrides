import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserView from './UserView';
import styled from 'styled-components';


const MiddRidesTitle = styled.h1`
 text-align: center;
`

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
    };
  }
  render() {
      if(this.state.viewmode === "UserStart"){
        const userview = (<UserView
        changeView={() => this.setState({viewmode: "RequestRide"})}
        />);
      return (
        <div className="App">
          {userview}
        </div>
      );
      }
      else if(this.state.viewmode === "RequestRide"){
        return ("hello world");
        //show request form
        //this is where the request ride html elements should go
      }
  }
}

export default ContentArea;
