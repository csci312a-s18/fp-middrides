/* eslint-disable no-underscore-dangle */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React, { Component } from 'react';
import styled from 'styled-components';

import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';

import { calculateETA, totalRunningTime } from './Algorithm';
// import calculateETA from './Algorithm';
// import totalRunningTime from './Algorithm';

const DivContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin: auto;
`;
const QueueContainer = styled.div`
  position: absolute;
  top: 510px;
`;

const ButtonBar = styled.div`
`;

const CenteredContainer = styled.div`
  text-align: center;
`;

const paths = [];

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
      requests: [],
      currentRequest: null,
      password: '',
      currentStop: 'Adirondack Circle',
      seatsLeft: 14,
      nextStop: '',
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
      if (this.state.currentRequest) { // Update existing request
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
          this.setState({
            requests: updatedRequests,
            currentRequest: updatedRequest,
          });
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
          const updatedRequests = this.state.requests.slice();
          updatedRequests.push(createdRequest);

          this.setState({
            requests: updatedRequests,
            currentRequest: createdRequest,
          });
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
    }).then(() => {
      const updatedRequests = this.state.requests
        .filter(request => request._id !== this.state.currentRequest._id);
      this.setState({ requests: updatedRequests });
      this.setState({ currentRequest: null });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
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
      alert('Wrong password. Try again!'); // eslint-disable-line no-alert
    }
  }

  recursiveAlgorithm(currentStop, requests, path, seatsLeft) {
    const updatedRequests = [];
    const id = [];
    requests.forEach(request => updatedRequests.push(Object.assign({}, request)));

    // when multiple requests are made from the same stop so that the bus is full,
    // this algorithm gives priority to the requests that were made earlier

    // either set request to "picked up" or remove from list
    updatedRequests.forEach((request) => {
      if (!request.isPickedUp && request.currentLocation === currentStop && (
        request.passengers <= seatsLeft)) {
        seatsLeft -= request.passengers; // eslint-disable-line no-param-reassign
        request.isPickedUp = true;
        id.push(request._id);
      } else if (request.isPickedUp && request.destination === currentStop) {
        seatsLeft += request.passengers; // eslint-disable-line no-param-reassign
        id.push(request._id);
        updatedRequests.splice(updatedRequests.indexOf(request), 1);
      }
    });


    path.push({ currentStop, id });

    // create list of available stops
    const available = [];
    for (let i = 0; i < updatedRequests.length; i++) {
      if (!updatedRequests[i].isPickedUp) {
        if (seatsLeft - updatedRequests[i].passengers >= 0) {
          available.push(updatedRequests[i].currentLocation);
        }
      } else {
        available.push(updatedRequests[i].destination);
      }
    }
    // base case
    if (available.length === 0) {
      paths.push(path);
    } else {
      for (let i = 0; i < available.length; i++) {
        // double check if we need to copy seatsLeft before passing to the next funciton
        this.recursiveAlgorithm(available[i], updatedRequests, path.slice(), seatsLeft);
      }
    }
  }

  runAlgorithm() {
    this.recursiveAlgorithm(this.state.currentStop, this.state.requests, [], this.state.seatsLeft);
    const optimalPath = totalRunningTime(paths, this.state.requests);
    let updatedRequests = [];
    this.state.requests.forEach(request => updatedRequests.push(Object.assign({}, request)));
    const newRequests = calculateETA(updatedRequests, optimalPath);

    for (let i = 0; i < newRequests.length; i++) {
      fetch(`/requests/${newRequests[i]._id}`, {
        method: 'PUT',
        body: JSON.stringify(newRequests[i]),
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      }).then((updatedRequest) => { // eslint-disable-line no-loop-func
        updatedRequests = this.state.requests.map((request) => {
          if (request._id === updatedRequest._id) {
            return updatedRequest;
          }
          return request;
        });
        this.setState({ requests: updatedRequests });
        this.setState({ nextStop: optimalPath[0].currentStop });
      }).catch(err => console.log(err)); // eslint-disable-line no-console
    }
  }

  makeInactive(id) {
    const findInactiveRequest = this.state.requests.find(request => request.id === id);
    const inactiveRequest = Object.assign({}, findInactiveRequest, { active: false });
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
    }).then(() => {
      const updatedRequests = this.state.requests
        .filter(request => request._id !== id);
      this.setState({ requests: updatedRequests });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  makePickedUp(id) {
    const findPickedUpRequest = this.state.requests.find(request => request.id === id);
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
    }).then(() => {
      const updatedRequests = this.state.requests
        .filter(request => request._id !== id);
      this.setState({ requests: updatedRequests });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
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
    // view for user
    if (this.state.viewmode === 'UserStart') {
      // const queueview = (<QueueView
      //   requests={this.state.requests}
      //   mode={this.state.viewmode}
      // />);

      const requestRideButton = (<input
        type="button"
        value="Request Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);

      const editRideButton = (<input
        type="button"
        value="Edit Ride"
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
        buttons = (<ButtonBar>{editRideButton}{cancelRideButton}{enterDispatcherView}</ButtonBar>);
      } else {
        buttons = (<ButtonBar>{requestRideButton}{enterDispatcherView}</ButtonBar>);
      }

      // {queueview}
      return (
        <DivContainer>
          <GPS isDispatcher={false} />
          <QueueContainer>
            {buttons}

            <br />
            Next Stop: {this.state.nextStop}
          </QueueContainer>
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
          <GPS isDispatcher />
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
    }
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

export default ContentArea;
