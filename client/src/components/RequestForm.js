/*
  RequestForm implements a form for creating a new ride request or editing an existing
  one.

  Note: Editing functionality is not currently implemented.

  props:
    request: The request to be edited [optional]
    complete: A callback to submit a new or edited request
*/

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { RequestShape } from './Request';

class RequestForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.request ? props.request.name : '',
      passengers: props.request ? props.request.passengers : '',
      currentLocation: props.request ? props.request.currentLocation : '',
      destination: props.request ? props.request.destination : '',
    };

    this.handleName = this.handleName.bind(this);
    this.handlePassengers = this.handleSelect.bind(this, 'passengers');
    this.handleCurrentLocation = this.handleSelect.bind(this, 'currentLocation');
    this.handleDestination = this.handleSelect.bind(this, 'destination');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleName(event) {
    this.setState({ name: event.target.value });
  }

  handleSelect(field, event) {
    this.setState({ [field]: event.target.value });
  }

  handleSubmit() {
    const now = new Date();
    const newRequest = {
      name: this.state.name,
      passengers: parseInt(this.state.passengers, 10),
      currentLocation: this.state.currentLocation,
      destination: this.state.destination,
      active: true,
      isPickedUp: false,
      timestamp: now.toISOString(),
      ETA: 100000,
    };
    this.props.complete(newRequest);
  }

  handleCancel() {
    this.setState({
      name: '',
      passengers: '',
      currentLocation: '',
      destination: '',
    });
    this.props.complete();
  }

  isDisabled() {
    return this.state.name === '' ||
    this.state.passengers === '' ||
    this.state.currentLocation === '' ||
    this.state.destination === '' ||
    this.state.currentLocation === this.state.destination;
  }

  render() {
    const name = (
      <FormGroup controlId="name">
        <ControlLabel>Name</ControlLabel>
        <FormControl
          type="text"
          value={this.state.name}
          placeholder="Name"
          onChange={this.handleName}
        />
      </FormGroup>);

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

    const passengerOptions = numbers.map(number => (
      <option value={number}>{number}</option>
    ));

    const passengers = (
      <FormGroup controlId="passengers">
        <ControlLabel>Number of Passengers</ControlLabel>
        <FormControl
          componentClass="select"
          value={this.state.passengers}
          onChange={this.handlePassengers}
        >
          <option value="" disabled hidden>0</option>
          {passengerOptions}
        </FormControl>
      </FormGroup>);

    const stops = ['Adirondack Circle', 'Track Lot/KDR', 'E Lot', 'R Lot', 'T Lot', 'Q Lot', 'Robert A. Jones House', 'McCullough Student Center', 'Frog Hollow'];

    const stopOptions = stops.map(stop => (
      <option value={stop}>{stop}</option>
    ));

    const currentLocation = (
      <FormGroup controlId="currentLocation">
        <ControlLabel>Current Location</ControlLabel>
        <FormControl
          componentClass="select"
          value={this.state.currentLocation}
          onChange={this.handleCurrentLocation}
        >
          <option value="" disabled hidden>Select a current location</option>
          {stopOptions}
        </FormControl>
      </FormGroup>);

    const destination = (
      <FormGroup controlId="destination">
        <ControlLabel>Destination</ControlLabel>
        <FormControl
          componentClass="select"
          value={this.state.destination}
          onChange={this.handleDestination}
        >
          <option value="" disabled hidden>Select a destination</option>
          {stopOptions}
        </FormControl>
      </FormGroup>);

    return (
      <form>
        {name}
        {passengers}
        {currentLocation}
        {destination}
        <Button id="btnSubmitRide" bsStyle="primary" disabled={this.isDisabled()} onClick={this.handleSubmit}>Submit</Button>
        <Button id="btnCancel" onClick={this.handleCancel}>Cancel</Button>
      </form>
    );
  }
}

RequestForm.propTypes = {
  request: RequestShape,
  complete: PropTypes.func.isRequired,
};

RequestForm.defaultProps = {
  request: null,
};

export default RequestForm;
