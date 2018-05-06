/* eslint-disable no-underscore-dangle */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React, { Component } from 'react';
import styled from 'styled-components';

import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';

import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';

import { calculateETA, totalRunningTime } from './Algorithm';
// import calculateETA from './Algorithm';
// import totalRunningTime from './Algorithm';


const QueueContainer = styled.div`
  position: absolute;
  top: 530px;
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
    if (this.state.viewmode === 'RequestRideUser') {
      // Switch to the user main view
      this.setState({ viewmode: 'UserStart' });
    } else {
      // Switch to the dispatcher view
      this.setState({ viewmode: 'DispatcherMode' });
    }
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

      const requestRideButton = (
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'RequestRideUser' })}
        >
        Request Ride
        </Button>);

      const cancelRideButton = (
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={this.handleCancel}
        >
        Cancel Ride
        </Button>);

      const enterDispatcherView = (
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'DispatcherLogin' })}
        >
        Dispatcher Log-In
        </Button>);

      let buttons;

      if (this.state.currentRequest) {
        buttons = (<ButtonToolbar>{cancelRideButton}{enterDispatcherView}</ButtonToolbar>);
      } else {
        buttons = (<ButtonToolbar>{requestRideButton}{enterDispatcherView}</ButtonToolbar>);
      }

      // {queueview}
      return (
        <div>
          <GPS isDispatcher={false} />
          <QueueContainer>
            {buttons}
            <br />
            Next Stop: {this.state.nextStop}
          </QueueContainer>
        </div>
      );

    // view dispatcher mode
    } else if (this.state.viewmode === 'DispatcherMode') {
      const queueview = (<QueueView
        requests={this.state.requests}
        mode={this.state.viewmode}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
      />);

      const addRideButton = (
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'RequestRideDispatcher' })}
        >
        Add a Ride
        </Button>);

      const enterDispatcherView = (
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'UserStart' })}
        >
        Dispatcher Log-out
        </Button>);

      const buttons = (<ButtonToolbar>{addRideButton}{enterDispatcherView}</ButtonToolbar>);

      return (
        <div>
          <GPS isDispatcher />
          {buttons}
          <br />
          {queueview}
        </div>
      );
      // view to request a ride for User
    } else if (this.state.viewmode === 'RequestRideUser') {
      return (
        <RequestForm
          requests={this.state.currentRequest}
          complete={(newRequest) => { this.handleFormReturn(newRequest); }}
        />
      );
    // view to request a ride for Dispatcher
    } else if (this.state.viewmode === 'RequestRideDispatcher') {
      return (
        <RequestForm
          requests={this.state.currentRequest}
          complete={(newRequest) => { this.handleFormReturn(newRequest); }}
        />
      );
    }
    // view to login to dispatchermode
    return (
      <div id="dispatcherform">
        <h5>Dispatcher Log-In</h5>
        <br />
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Password:
            </Col>
            <Col sm={9}>
              <FormControl
                id="formControlsText"
                type="password"
                label="Text"
                placeholder="Enter Password"
                onChange={this.handlePassword}
              />
            </Col>
          </FormGroup>
          <Button
            bsStyle="primary"
            bsSize="medium"
            onClick={this.handleLogin}>
            Login
          </Button>
          <Button
            bsSize="medium"
            onClick={this.handleCancelLogin}>
            Cancel
          </Button>
        </Form>
      </div>
    );
  }
}

export default ContentArea;
