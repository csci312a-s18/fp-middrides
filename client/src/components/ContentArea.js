import React, { Component } from 'react';
import styled from 'styled-components';
import QueueView from './QueueView';

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
      queue: [],
    };
  }

  componentDidMount() {
    fetch('/requests', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(this.sortRequests);
        console.log(sortedData);
        this.setState({ queue: sortedData });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
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
        queue={this.state.queue}
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
