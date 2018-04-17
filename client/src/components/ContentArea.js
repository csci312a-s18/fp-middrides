import React, { Component } from 'react';
import styled from 'styled-components';
import QueueView from './QueueView';

// replace the placeholder requests with the requests from server
const fakeRequests = [];
const req1 = {
  id: 1,
  from: 'Bihall',
  to: 'Atwater',
  count: 2,
  completed: 'No',
};

const req2 = {
  id: 2,
  from: 'Proctor',
  to: 'ADK',
  count: 3,
  completed: 'Yes',
};

const req3 = {
  id: 3,
  from: 'E lot',
  to: 'Ridgeline',
  count: 1,
  completed: 'No',
};

fakeRequests.push(req1);
fakeRequests.push(req2);
fakeRequests.push(req3);


const DivContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
      requests: fakeRequests, // replace this with the requests from server
    };
  }
  render() {
    if (this.state.viewmode === 'UserStart') {
      const gps = (
        <p>
          so this is where the gps and all them stuff goes u feel.
          theres gonna be a lil box here with a gps of the car u feel.
          we dont have none of that ready yet so this is it for now
        </p>);
      const queueview = (<QueueView
        requests={this.state.requests}
      />);
      const btnRequestRide = (<input
        type="button"
        value="Request Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);
      return (
        <DivContainer>
          {gps}
          {queueview}
          <br />
          {btnRequestRide}
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
