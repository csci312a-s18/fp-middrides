/* eslint-disable no-underscore-dangle */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React, { Component } from 'react';
import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col, Panel, Well } from 'react-bootstrap';
import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';
import { enumeratePaths, calculateETA, findOptimumPath, calculateWalkOns } from './Algorithm';
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
      nextStop: 'No request in queue',
      walkOns: 14,
      time: new Date(),
    };

    this.nextStopID = '5af88680f36d280cecd235bc';
    this.dispatcherExistsID = '5afb1243f36d28736375f968';

    this.handleCancel = this.handleCancel.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCancelLogin = this.handleCancelLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  updateNextStop(nextStop) {
    const newStop = Object.assign({}, {
      _id: {
        $oid: this.nextStopID,
      },
      nextStop: null,
    }, { nextStop });
    fetchHelper(`/nextStop/${this.nextStopID}`, 'PUT', newStop).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  updateDispatcherState(state) {
    const newState = Object.assign({}, {
      _id: {
        $oid: this.dispatcherExistsID,
      },
      state: null,
    }, { state });
    fetchHelper(`/dispatcherExists/${this.dispatcherExistsID}`, 'PUT', newState).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  runAlgorithm() {
    if (this.state.requests.length === 0) {
      this.setState({ nextStop: 'No request in queue' });
      this.updateNextStop(this.state.nextStop);
      return;
    }
    const paths = enumeratePaths(this.state.currentStop, this.state.requests, this.state.seatsLeft);
    const now = (new Date()).toISOString;
    const optimalPath = findOptimumPath(this.state.requests, paths, Date.parse(now) / 60000);
    const getWalkOns = calculateWalkOns(this.state.requests, optimalPath, this.state.seatsLeft);
    let updatedRequests = [];
    this.state.requests.forEach(request => updatedRequests.push(Object.assign({}, request)));
    let newRequests;
    if (optimalPath.length > 0) {
      newRequests = calculateETA(updatedRequests, optimalPath, 0);
    } else {
      newRequests = [];
    }

    for (let i = 0; i < newRequests.length; i++) {
      fetchHelper(`/requests/${newRequests[i]._id}`, 'PUT', newRequests[i]).then((updatedRequest) => { // eslint-disable-line no-loop-func
        updatedRequests = this.state.requests.map((request) => {
          if (request._id === updatedRequest._id) {
            return updatedRequest;
          }
          return request;
        });
      }).then(() => { // eslint-disable-line no-loop-func
        const date = new Date();
        this.setState({ requests: updatedRequests, walkOns: getWalkOns, time: date });
        if (optimalPath.length > 1) {
          this.setState({ nextStop: optimalPath[1].currentStop });
        } else {
          this.setState({ nextStop: 'No request in queue' });
        }
        this.updateNextStop(this.state.nextStop);
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
    let state;
    fetch('/dispatcherExists', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        state = data[0].state; // eslint-disable-line prefer-destructuring
        fetch('/dispatcherPassword', { headers: new Headers({ Accept: 'application/json' }) })
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          })
          .then((dataa) => {
            const password = dataa[0].password; // eslint-disable-line prefer-destructuring
            if (this.state.password === password && !state) {
              this.setState({ viewmode: 'DispatcherMode' });
              this.updateDispatcherState(true);
              localStorage.setItem('dispatcher', '');
            } else if (state) {
              alert('Dispatcher already logged in'); // eslint-disable-line no-alert
            } else {
              alert('Incorrect password. Try again!'); // eslint-disable-line no-alert
            }
          })
          .catch(err => console.log(err)); // eslint-disable-line no-console
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
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
    localStorage.clear();
    alert('Thank you for using MiddRides!\nYour ride has been terminated.'); // eslint-disable-line no-alert
  }


  handleFormReturn(newRequest) {
    if (this.state.requests.length === 7) { // can't take more than 7 requests at a time
      alert('Sorry, the queue is full. Please try again later.'); // eslint-disable-line no-alert
      this.setState({ viewmode: this.state.viewmode === 'RequestRideUser' ? 'UserStart' : 'DispatcherMode' });
      return;
    }
    if (this.state.viewmode === 'RequestRideUser') {
      if (newRequest) {
        fetchHelper('/requests', 'POST', newRequest).then((createdRequest) => {
          const updatedRequests = this.state.requests.slice();
          updatedRequests.push(createdRequest);
          localStorage.setItem('request', createdRequest._id);
          this.setState({
            requests: updatedRequests,
            currentRequest: createdRequest,
          });
          if (this.state.nextStop === 'No request in queue') {
            this.runAlgorithm();
          }
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
        if (this.state.nextStop === '' || this.state.nextStop === 'No request in queue') {
          this.runAlgorithm();
        }
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
    this.updateDispatcherState(false);
    localStorage.removeItem('dispatcher');
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
      this.setState({
        requests: updatedRequests,
        currentStop: droppedOffRequest.destination,
        seatsLeft: this.state.seatsLeft + droppedOffRequest.passengers,
      });
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
        seatsLeft: this.state.seatsLeft - pickedUpRequest.passengers,
      });
      this.runAlgorithm();
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  sortRequests(a, b) { // eslint-disable-line class-methods-use-this
    if (a.ETA < b.ETA) {
      return -1;
    }
    if (a.ETA > b.ETA) {
      return 1;
    }
    return 0;
  }

  findCookie() {
    if (localStorage.getItem('request')) {
      const id = localStorage.getItem('request');
      if (this.state.requests.find(request => request._id === id) === undefined) {
        alert('Thank you for using MiddRides!\nYour ride has been terminated.'); // eslint-disable-line no-alert
        localStorage.clear();
        this.setState({ currentRequest: '' });
      } else if (this.state.requests.find(request => request._id === id) !== false) {
        const findLocalRequest = this.state.requests.find(request => request._id === id);
        if (findLocalRequest !== this.state.currentRequest) {
          this.setState({ currentRequest: findLocalRequest });
        }
      }
    }
  }

  findDispatcher() {
    if (localStorage.getItem('dispatcher') !== null) {
      if (this.state.viewmode !== 'DispatcherMode') {
        this.setState({ viewmode: 'DispatcherMode' });
      }
    }
  }

  render() {
    // view for user
    if (this.state.viewmode === 'UserStart') {
      this.findDispatcher();
      this.findCookie();

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
          bsStyle="danger"
          bsSize="small"
          onClick={this.handleCancel}
        >
        Cancel Ride
        </Button>);

      const enterDispatcherView = (
        <Button
          id="btnDispatcherLogin"
          bsStyle="link"
          bsSize="small"
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
          <br />
          <h4>
            <strong>Next Stop: </strong>{this.state.nextStop} arriving in ___ minutes <br /><br />
            <strong>Your Stop: </strong>{this.state.currentRequest ? this.state.currentRequest.currentLocation : '-'} arriving in ___ minutes
          </h4>
        </div>
      );

    // view dispatcher mode
    } else if (this.state.viewmode === 'DispatcherMode') {
      const queueview = (<QueueView
        id="qvActive"
        requests={this.state.requests.filter(request => request.isPickedUp === false)}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
        completeDroppedOff={(id) => { this.makeDroppedOff(id); }}
        time={this.state.time}
      />);

      const queueview2 = (<QueueView
        id="qvPickedUp"
        requests={this.state.requests.filter(request => request.isPickedUp === true)}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
        completeDroppedOff={(id) => { this.makeDroppedOff(id); }}
        time={this.state.time}
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
          bsSize="small"
          onClick={this.handleLogout}
        >
        Log-out
        </Button>
      );

      const buttons = (<ButtonToolbar>{addRideButton}<div className="login"> {enterDispatcherView} </div></ButtonToolbar>
      );

      const nextUpText = (<h4><strong>Next Stop:</strong> {this.state.nextStop}</h4>);

      const walkOnsLabel = (<h4><strong>Walk Ons Allowed:</strong> { this.state.walkOns } </h4>);

      const seatsLeftLabel = (<h4><strong>Seats Left</strong>: {this.state.seatsLeft } </h4>);

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
          {seatsLeftLabel}
          {walkOnsLabel}
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
              bsSize="small"
              onClick={this.handleLogin}
            >
            Login
            </Button>
            <Button
              id="btnCancelLogin"
              bsSize="small"
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
