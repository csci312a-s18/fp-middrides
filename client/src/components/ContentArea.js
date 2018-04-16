import React, { Component } from 'react';
import styled from 'styled-components';
import UserView from './UserView';

const DivContainer = styled.div`
  margin: 40px;
`;

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
    };
  }
  render() {
    if (this.state.viewmode === 'UserStart') {
      const userview = (<UserView
        changeView={() => this.setState({ viewmode: 'RequestRide' })}
      />);
      return (
        <DivContainer>
          {userview}
        </DivContainer>
      );
    } else if (this.state.viewmode === 'RequestRide') {
      const btnCancelRide = (<input
        type="button"
        value="Cancel"
        onClick={() => this.setState({ viewmode: 'UserStart' })}
      />);
      const btnSubmitRide = (<input
        type="button"
        value="Submit"
        onClick={() => this.setState({ viewmode: 'UserStart' })}
      />);
      return (
        <DivContainer>
          <div>
            Hello World! This is where the queue and names of passengers
            and stuff will go. below is the submit and cancel buttons,
            one of them cancels the request and takes u back to prev page
            and submit submits the ride.
          </div>
          <div>{btnSubmitRide} {btnCancelRide}</div>
        </DivContainer>
      );
      // show request form
      // this is where the request ride html elements should go
    }
    return (
      <div> hello </div>
    );
  }
}

export default ContentArea;