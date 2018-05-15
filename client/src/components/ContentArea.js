/* eslint-disable no-underscore-dangle */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React, { Component } from 'react';
import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col, Well, Panel } from 'react-bootstrap';
import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';
import { enumeratePaths, calculateETA, findOptimumPath } from './Algorithm';
import fetchHelper from './Helpers';

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart', // DispatcherMode, DispatcherLogin, RequestRideUser, RequestRideDispatcher
      requests: [],
      currentRequest: null,
      password: '',
      currentStop: 'Adirondack Circle',
      seatsLeft: 14,
      nextStop: '',
    };

    this.nextStopID = '5af88680f36d280cecd235bc';

    this.handleCancel = this.handleCancel.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCancelLogin = this.handleCancelLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getNextStop();
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      interval: setInterval(() => { // eslint-disable-line react/no-unused-state
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
      }, 1000),
    });
  }

  getNextStop() {
    fetch('/nextStop', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ nextStop: data[0].nextStop });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  updateNextStop() {
    const nextStop = this.state.nextStop; // eslint-disable-line prefer-destructuring
    const newStop = Object.assign({}, {
      _id: {
        $oid: this.nextStopID,
      },
      nextStop: null,
    }, { nextStop });
    fetchHelper(`/nextStop/${this.nextStopID}`, 'PUT', newStop).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  runAlgorithm() {
    const paths = enumeratePaths(this.state.currentStop, this.state.requests, this.state.seatsLeft);
    const now = (new Date()).toISOString;
    const optimalPath = findOptimumPath(this.state.requests, paths, Date.parse(now) / 60000);
    let updatedRequests = [];
    this.state.requests.forEach(request => updatedRequests.push(Object.assign({}, request)));
    const newRequests = calculateETA(updatedRequests, optimalPath, 0);
    for (let i = 0; i < newRequests.length; i++) {
      fetchHelper(`/requests/${newRequests[i]._id}`, 'PUT', newRequests[i]).then((updatedRequest) => { // eslint-disable-line no-loop-func
        updatedRequests = this.state.requests.map((request) => {
          if (request._id === updatedRequest._id) {
            return updatedRequest;
          }
          return request;
        });
        this.setState({ requests: updatedRequests });
        if (optimalPath[1].currentStop) {
          this.setState({ nextStop: optimalPath[1].currentStop });
        }
        this.updateNextStop();
        this.getNextStop();
      }).catch(err => console.log(err)); // eslint-disable-line no-console
    }
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
      alert('Incorrect password. Try again!'); // eslint-disable-line no-alert
    }
  }

  handleCancel() {
    const cancelledRequest = Object.assign({}, this.state.currentRequest, { active: false });
    fetchHelper(`/requests/${this.state.currentRequest._id}`, 'PUT', cancelledRequest).then(() => {
      const updatedRequests = this.state.requests
        .filter(request => request._id !== this.state.currentRequest._id);
      this.setState({
        requests: updatedRequests,
        currentRequest: null,
      });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
    this.setState({ currentRequest: null }); // this is done for tests that do not use the fetch
  }


  handleFormReturn(newRequest) {
    if (this.state.viewmode === 'RequestRideUser') {
      if (newRequest) {
        fetchHelper('/requests', 'POST', newRequest).then((createdRequest) => {
          const updatedRequests = this.state.requests.slice();
          updatedRequests.push(createdRequest);
          this.setState({
            requests: updatedRequests,
            currentRequest: createdRequest,
          });
        }).catch(err => console.log(err)); // eslint-disable-line no-console
      }
      this.setState({ viewmode: 'UserStart' });
    } else { // If requestor is the Dispatcher
      fetchHelper('/requests', 'POST', newRequest).then((createdRequest) => {
        const updatedRequests = this.state.requests.slice();
        updatedRequests.push(createdRequest);
        this.setState({
          requests: updatedRequests,
          currentRequest: null, // allows for multiple requests by Dispatcher // unnecessary
        });
      }).catch(err => console.log(err)); // eslint-disable-line no-console
      this.setState({ viewmode: 'DispatcherMode' });
    }
  }

  makeInactive(id) {
    const findInactiveRequest = this.state.requests.find(request => request._id === id);
    const inactiveRequest = Object.assign({}, findInactiveRequest, { active: false });
    fetchHelper(`/requests/${id}`, 'PUT', inactiveRequest).then(() => {
      const updatedRequests = this.state.requests
        .filter(request => request._id !== id);
      this.setState({ requests: updatedRequests });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  handleLogout() {
    this.setState({ viewmode: 'UserStart' });
    window.location.reload();
  }
  makeDroppedOff(id) {
    const findDroppedOffRequest = this.state.requests.find(request => request._id === id);
    const droppedOffRequest = Object.assign({}, findDroppedOffRequest, { active: false });
    fetch(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(droppedOffRequest),
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
      this.setState({ requests: updatedRequests, currentStop: droppedOffRequest.destination });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  makePickedUp(id) {
    const findPickedUpRequest = this.state.requests.find(request => request._id === id);
    const pickedUpRequest = Object.assign({}, findPickedUpRequest, { isPickedUp: true, ETA: -1 });
    fetchHelper(`/requests/${id}`, 'PUT', pickedUpRequest).then(() => {
      const updatedRequests = this.state.requests.map((request) => {
        if (request._id === id) {
          return pickedUpRequest;
        }
        return request;
      });
      this.setState({
        requests: updatedRequests,
        currentStop: pickedUpRequest.currentLocation,
      });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  sortRequests(a, b) { // eslint-disable-line class-methods-use-this
    // if (a.ETA === 'Calculating...' && b.ETA !== 'Calculating...') {
    //   return 1;
    // }
    // if (a.ETA !== 'Calculating...' && b.ETA === 'Calculating...') {
    //   return -1;
    // }
    if (a.ETA < b.ETA) {
      return -1;
    }
    if (a.ETA > b.ETA) {
      return 1;
    }
    return 0;
  }

  render() {
    // view for user
    if (this.state.viewmode === 'UserStart') {
      const requestRideButton = (
        <Button
          id="btnRequestRide"
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'RequestRideUser' })}
        >
        Request Ride
        </Button>);

      const cancelRideButton = (
        <Button
          id="btnCancelRide"
          bsStyle="primary"
          bsSize="small"
          onClick={this.handleCancel}
        >
        Cancel Ride
        </Button>);

      const enterDispatcherView = (
        <Button
          id="btnDispatcherLogin"
          bsStyle="link"
          bsSize="medium"
          onClick={() => this.setState({ viewmode: 'DispatcherLogin' })}
        >
        Log-In
        </Button>);

      let buttons;

      if (this.state.currentRequest) {
        buttons = (<ButtonToolbar>{cancelRideButton} <div className="login">  {enterDispatcherView} </div></ButtonToolbar>);
      } else {
        buttons = (<ButtonToolbar>{requestRideButton} <div className="login">  {enterDispatcherView} </div></ButtonToolbar>);
      }

      return (
        <div>
          {buttons}
          <div className="gps"> <GPS isDispatcher={false} id="gps" /> </div>
          <br />
          <h4>Next Stop: {this.state.nextStop}</h4>
          <h4>Number of seats available: </h4>
        </div>
      );

    // view dispatcher mode
    } else if (this.state.viewmode === 'DispatcherMode') {
      const queueview = (<QueueView
        id="qvActive"
        requests={this.state.requests.filter(request => request.isPickedUp === false)}
        mode={this.state.viewmode}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
        completeDroppedOff={(id) => { this.makeDroppedOff(id); }}
      />);
      const queueview2 = (<QueueView
        id="qvPickedUp"
        requests={this.state.requests.filter(request => request.isPickedUp === true)}
        mode={this.state.viewmode}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
        completeDroppedOff={(id) => { this.makeDroppedOff(id); }}
      />);

      const addRideButton = (
        <Button
          id="btnAddRide"
          bsStyle="primary"
          bsSize="small"
          onClick={() => this.setState({ viewmode: 'RequestRideDispatcher' })}
        >
        Add a Ride
        </Button>);

      const enterDispatcherView = (
        <Button
          id="btnLogout"
          bsStyle="link"
          bsSize="medium"
          onClick={this.handleLogout}>
        Log-out
        </Button>);

      const buttons = (<ButtonToolbar>{addRideButton}<div className="login"> {enterDispatcherView} </div></ButtonToolbar>
      );

      const nextUpText = (<p>Next Stop: {this.state.nextStop}</p>);

      return (
        <div>
          {buttons}
          {nextUpText}
          <br />
          <Panel bsStyle="info">
            <Panel.Heading>
              <Panel.Title componentClass="h3">To Be Picked Up</Panel.Title>
            </Panel.Heading>
            {queueview}
          </Panel>

          <Panel bsStyle="success">
            <Panel.Heading>
              <Panel.Title componentClass="h3">Currently In Van</Panel.Title>
            </Panel.Heading>
            {queueview2}
          </Panel>
          <div className="gps"> <GPS isDispatcher /> </div>
        </div>
      );
      // view to request a ride for User
    } else if (this.state.viewmode === 'RequestRideUser') {
      return (
        <Well>
          <RequestForm
            requests={this.state.currentRequest}
            complete={(newRequest) => { this.handleFormReturn(newRequest); }}
          />
        </Well>
      );
      // view to request a ride for Dispatcher
    } else if (this.state.viewmode === 'RequestRideDispatcher') {
      return (
        <Well>
          <RequestForm
            requests={this.state.currentRequest}
            complete={(newRequest) => { this.handleFormReturn(newRequest); }}
          />
        </Well>
      );
    }
    // viewmode is DispatcherLogin
    return (
      <div id="dispatcherform">
        <Well bsSize="large">
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
                  onKeyDown={(press) => {
                    if (press.keyCode === 13) { // if key pressed is ENTER
                      press.preventDefault();
                      this.handleLogin();
                    }
                    }}
                />
              </Col>
            </FormGroup>
            <Button
              id="btnDispatcherLoginFinal"
              bsStyle="primary"
              bsSize="medium"
              onClick={this.handleLogin}
            >
            Login
            </Button>
            <Button
              id="btnCancelLogin"
              bsSize="medium"
              onClick={this.handleCancelLogin}
            >
            Cancel
            </Button>
          </Form>
        </Well>
      </div>
    );
  }
}

export default ContentArea;
