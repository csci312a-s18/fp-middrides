/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import styled from 'styled-components';

import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';

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
    fetch('/requests', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(this.sortRequests);
        this.setState({ requests: sortedData });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleFormReturn(newRequest) {
    if (newRequest) { // Not a cancel
      if (this.state.currentArticle) { // Update existing request
        fetch(`/requests/${this.state.currentRequest._id}`, {
          method: 'PUT',
          body: JSON.stringify(newRequest),
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
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
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(response.status_text);
          }
          return response.json();
        }).then((createdRequest) => {
          const updatedRequests = this.state.requests;
          updatedRequests.push(createdRequest);
          this.setState({ requests: updatedRequests });
          this.setState({ currentRequest: createdRequest });
        }).catch(err => console.log(err)); // eslint-disable-line no-console
      }
    }
    // Switch to the user main view
    this.setState({ viewmode: 'UserStart' });
  }

  handleCancel() {
    const cancelledRequest = Object.assign({}, this.state.currentRequest, { active: false });
    fetch(`/requests/${this.state.currentRequest._id}`, {
      method: 'PUT',
      body: JSON.stringify(cancelledRequest),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
    const updatedRequests = this.state.requests
      .filter(request => request._id !== this.state.currentRequest._id);
    this.setState({ requests: updatedRequests });
    this.setState({ currentRequest: null });
  }

  sortRequests(a, b) { // eslint-disable-line class-methods-use-this
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  }

  render() {
    if (this.state.viewmode === 'UserStart') {
      const queueview = (<QueueView
        requests={this.state.requests}
      />);

      const requestRideButton = (<input
        type="button"
        value="Request Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);

      // const changeRideButton = (<input
      //   type="button" value="Change Ride"
      //   onClick={() => this.setState({ viewmode: 'RequestRide' })}
      // />);

      const cancelRideButton = (<input
        type="button"
        value="Cancel Ride"
        onClick={this.handleCancel}
      />);

      let buttons;
      if (this.state.currentRequest) {
        buttons = (<ButtonBar>{cancelRideButton}</ButtonBar>);
      } else {
        buttons = (<ButtonBar>{requestRideButton}</ButtonBar>);
      }

      return (
        <DivContainer>
          <GPS />
          {queueview}
          <br />
          {buttons}
        </DivContainer>
      );
    }
    return (
      <RequestForm
        request={this.state.currentRequest}
        complete={(newRequest) => { this.handleFormReturn(newRequest); }}
      />
    );
  }
}

export default ContentArea;
