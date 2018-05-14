/* eslint-disable no-underscore-dangle */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import React, { Component } from 'react';
import { Button, ButtonToolbar, Form, FormGroup, FormControl, ControlLabel, Col, Well, Panel, PageHeader } from 'react-bootstrap';
import QueueView from './QueueView';
import RequestForm from './RequestForm';
import GPS from './GPS';
import { enumeratePaths, calculateETA, findOptimumPath } from './Algorithm';
// import calculateETA from './Algorithm';
// import findOptimumPath from './Algorithm';

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

    this.nextStopID = '5af88680f36d280cecd235bc';

    this.handleCancel = this.handleCancel.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleCancelLogin = this.handleCancelLogin.bind(this);
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

    fetch(`/nextStop/${this.nextStopID}`, {
      method: 'PUT',
      body: JSON.stringify(newStop),
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

  runAlgorithm() {
    const paths = enumeratePaths(this.state.currentStop, this.state.requests, this.state.seatsLeft);
    const now = (new Date()).toISOString;
    const optimalPath = findOptimumPath(this.state.requests, paths, Date.parse(now)/60000);
    let updatedRequests = [];
    this.state.requests.forEach(request => updatedRequests.push(Object.assign({}, request)));
    const newRequests = calculateETA(updatedRequests, optimalPath, 0);

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

  handleFormReturn(newRequest) {
    if (this.state.viewmode === 'RequestRideUser') {
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
      this.setState({ viewmode: 'UserStart' });
    } else { // If requestor is the Dispatcher
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
          currentRequest: null, // allows for multiple requests by Dispatcher
        });
      }).catch(err => console.log(err)); // eslint-disable-line no-console


      this.setState({ viewmode: 'DispatcherMode' });
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
    const findPickedUpRequest = this.state.requests.find(request => request._id === id);
    const pickedUpRequest = Object.assign({}, findPickedUpRequest, { isPickedUp: true, ETA: -1 });
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
      // const updatedRequests = this.state.requests
      //   .filter(request => request._id !== id);
      // this.setState({ requests: updatedRequests });
      const updatedRequests = this.state.requests.map((request) => {
        if (request._id === id) {
          return pickedUpRequest;
        }
        return request;
      });
      this.setState({ requests: updatedRequests, currentStop: pickedUpRequest.currentLocation });
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
          id="btnCancleRide"
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
          bsSize="large"
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

      // {queueview}
      return (
        <div>
          {buttons}
          <div className="gps"> <GPS isDispatcher={false} /> </div>
          <PageHeader>
            <small>Next Stop: {this.state.nextStop}</small>
          </PageHeader>
        </div>
      );

    // view dispatcher mode
    } else if (this.state.viewmode === 'DispatcherMode') {
      const queueview = (<QueueView
        requests={this.state.requests.filter(request => request.isPickedUp === false)}
        mode={this.state.viewmode}
        completeInactive={(id) => { this.makeInactive(id); }}
        completePickedUp={(id) => { this.makePickedUp(id); }}
      />);
      const queueview2 = (<QueueView
        requests={this.state.requests.filter(request => request.isPickedUp === true)}
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
          bsStyle="link"
          bsSize="medium"
          onClick={() => this.setState({ viewmode: 'UserStart' })}
          onClick={() =>// eslint-disable-line react/jsx-no-duplicate-props
            window.location.reload()}
        >
        Log-out
        </Button>);

      const buttons = (<ButtonToolbar>{addRideButton}<div className="login"> {enterDispatcherView} </div></ButtonToolbar>
      );

      return (
        <div>
          {buttons}
          <br />
          <Panel bsStyle="info">
            <Panel.Heading>
              <Panel.Title componentClass="h3">To be Picked Up</Panel.Title>
            </Panel.Heading>
            {queueview}
          </Panel>

          <Panel bsStyle="success">
            <Panel.Heading>
              <Panel.Title componentClass="h3">Currently In Van</Panel.Title>
            </Panel.Heading>
            {queueview2}
          </Panel>
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
    // view to login to dispatchermode
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
                />
              </Col>
            </FormGroup>
            <Button
              bsStyle="primary"
              bsSize="medium"
              onClick={this.handleLogin}
            >
            Login
            </Button>
            <Button
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
