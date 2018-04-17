import React, { Component } from 'react';
import styled from 'styled-components';

import QueueView from './QueueView';
import RequestForm from './RequestForm';

const DivContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonBar = styled.div`
`;

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
      requests: [],
      currentRequest: null,
    };

    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    fetch('/requests')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ requests: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleFormReturn(newRequest) {
      if (newRequest) { // Not a cancel
        if (this.state.currentArticle) { // Update existing request
          fetch(`/requests/${this.state.currentRequest._id}`, {
            method: 'PUT',
            body: JSON.stringify(newRequest),
            headers: new Headers({ 'Content-type': 'application/json' }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          }).then((updatedRequest) => {
            const updatedRequests = this.state.requests.map((request) => {
              if (request._id === updatedRequest._id) {
                return updatedRequest;
              }
              return request;
            });
            this.setState({ requests: updatedRequests });
            this.setState({ currentRequest: updatedRequest });
          }).catch(err => console.log(err)); // eslint-disable-line no-console
        } else { // Create new request
          fetch('/requests', {
            method: 'POST',
            body: JSON.stringify(newRequest),
            headers: new Headers({ 'Content-type': 'application/json' }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          }).then((createdRequest) => {
            const updatedRequests = this.state.requests;
            updatedRequests.push(createdRequest);
            this.setState({ requests: updatedRequests });
            this.setState({ currentArticle: createdRequest });
          }).catch(err => console.log(err)); // eslint-disable-line no-console
        }
    }
    // Switch to the user main view
    this.setState({ viewmode: 'UserStart'});
  }

  handleCancel() {
    const cancelledRequest = Object.assign(this.state.currentRequest, { active: false });
    fetch(`/requests/${this.state.currentRequest._id}`, {
      method: 'PUT',
      body: JSON.stringify(cancelledRequest),
      headers: new Headers({ 'Content-type': 'application/json' }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
    this.setState({ currentRequest: null });
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

      const requestRideButton = <input type="button" value="Request Ride" onClick={() => this.setState({ viewmode: 'RequestRide' })} />;
      const changeRideButton = <input type="button" value="Change Ride" onClick={() => this.setState({ mode: 'RequestRide' })} />;
      const cancelRideButton = (<input type="button" value="Cancel Ride" onClick={this.handleCancel}
      />);

      let buttons;
      if (this.state.currentArticle) {
        buttons = (<ButtonBar>{changeRideButton} {cancelRideButton}</ButtonBar>);
      } else {
        buttons = (<ButtonBar>{requestRideButton}</ButtonBar>);
      }

      return (
        <DivContainer>
          {gps}
          {queueview}
          <br />
          {buttons}
        </DivContainer>
      );
    }
    return (
      <RequestForm
        request={this.state.currentRequest}
        complete={(newRequest) => {this.handleFormReturn(newRequest); }}
      />
    );
  }
}

export default ContentArea;
