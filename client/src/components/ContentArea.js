/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import styled from 'styled-components';

import QueueView from './QueueView';
import RequestForm from './RequestForm';

const DivContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin: auto;
`;

const ButtonBar = styled.div`
`;

const CenteredContainer = styled.div`
  text-align: center;
`;

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
      requests: [],
      currentRequest: null,
      password: '',
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCancelLogin = this.handleCancelLogin.bind(this);
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

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleCancelLogin() {
    this.setState({ password: '', viewmode: 'UserStart' });
  }

  handleLogin() {
    if (this.state.password === '12345') { // temporary password
      this.setState({ viewmode: 'DispatcherMode' });
    } else {
      alert('Wrong password. Try again!');
    }
  }
  makeInactive(id) {
  const findInactiveRequest =  this.state.requests.find(request => request.id === id)
  console.log(findInactiveRequest);
  const inactiveRequest = Object.assign({}, findInactiveRequest, { active: false });
  console.log(inactiveRequest);
  fetch(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(inactiveRequest),
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
    .filter(request => request._id !== id);
  this.setState({ requests: updatedRequests });
  }
  makePickedUp(id) {
  const findPickedUpRequest =  this.state.requests.find(request => request.id === id)
  const pickedUpRequest = Object.assign({}, findPickedUpRequest, { isPickedUp: true });
  fetch(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pickedUpRequest),
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
  }

  sortRequests(a, b) { // eslint-disable-line class-methods-use-this
    if (a.timestamp < b.timestamp) {
      return 1;
    }
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    return 0;
  }

  render() {
    // view for user
    if (this.state.viewmode === 'UserStart') {
      const gps = (
        <p>
          GPS
        </p>);
      const queueview = (<QueueView
        requests={this.state.requests}
        mode={this.state.viewmode}
      />);

      const requestRideButton = (<input
        type="button"
        value="Request Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);

      const cancelRideButton = (<input
        type="button"
        value="Cancel Ride"
        onClick={this.handleCancel}
      />);

      const enterDispatcherView = (<input
        type="button"
        value="Dispatcher Log-In"
        onClick={() => this.setState({ viewmode: 'DispatcherLogin' })}
      />);

      let buttons;

      if (this.state.currentRequest) {
        buttons = (<ButtonBar>{cancelRideButton}{enterDispatcherView}</ButtonBar>);
      } else {
        buttons = (<ButtonBar>{requestRideButton}{enterDispatcherView}</ButtonBar>);
      }

      return (
        <DivContainer>
          {gps}
          {buttons}
          <br />
          {queueview}
          <br />
        </DivContainer>
      );

    // view dispatcher mode
    } else if (this.state.viewmode === 'DispatcherMode') {
      const queueview = (<QueueView
        requests={this.state.requests}
        mode={this.state.viewmode}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
      />);

      const addRideButton = (<input
        type="button"
        value="Add a Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);

      const enterDispatcherView = (<input
        type="button"
        value="Dispatcher Log-out"
        onClick={() => this.setState({ viewmode: 'UserStart' })}
      />);

      const buttons = (<ButtonBar>{addRideButton}{enterDispatcherView}</ButtonBar>);

      return (
        <DivContainer>
          <CenteredContainer>
          Dispatcher Mode
          </CenteredContainer>
          {buttons}
          <br />
          {queueview}
          <br />
        </DivContainer>
      );
      // view to request a ride
    } else if (this.state.viewmode === 'RequestRide') {
      return (
        <RequestForm
          requests={this.state.currentRequest}
          complete={(newRequest) => { this.handleFormReturn(newRequest); }}
        />
      );
    // view to login to dispatchermode
    } else if (this.state.viewmode === 'DispatcherLogin') {
      return (
        <CenteredContainer>
          Password:
          <input type="password" onChange={this.handlePassword} />
          <br />
          <input type="button" value="Login" onClick={this.handleLogin} />
          <input type="button" value="Cancel" onClick={this.handleCancelLogin} />
        </CenteredContainer>
      );
    }
  }
}

export default ContentArea;
