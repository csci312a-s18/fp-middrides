/*
  RequestForm implements a form for creating a new ride request or editing an existing
  one.

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
      ETA: 'Calculating...',
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

  render() {
    return (
      <form>
        <FormGroup controlId="name">
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.name}
            placeholder="Name"
            onChange={this.handleName}
          />
        </FormGroup>

        <FormGroup controlId="passengers">
          <ControlLabel>Number of Passengers</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="Passengers"
            value={this.state.passengers}
            onChange={this.handlePassengers}
          >
            <option value="select"> select </option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
            <option value="3"> 3 </option>
            <option value="4"> 4 </option>
            <option value="5"> 5 </option>
            <option value="6"> 6 </option>
            <option value="7"> 7 </option>
            <option value="8"> 8 </option>
            <option value="9"> 9 </option>
            <option value="10"> 10 </option>
            <option value="11"> 11 </option>
            <option value="12"> 12 </option>
            <option value="13"> 13 </option>
            <option value="14"> 14 </option>
          </FormControl>
        </FormGroup>

        <FormGroup controlId="currentLocation">
          <ControlLabel>Select a Current Location</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="CurrentLocation"
            value={this.state.currentLocation}
            onChange={this.handleCurrentLocation}
          >
            <option value="select"> select </option>
            <option value="Adirondack Circle"> Adirondack Circle </option>
            <option value="Track Lot/KDR"> Track Lot/KDR </option>
            <option value="E Lot"> E Lot </option>
            <option value="R Lot"> R Lot </option>
            <option value="T Lot"> T Lot </option>
            <option value="Q Lot"> Q Lot </option>
            <option value="Robert A. Jones House"> Robert A. Jones House </option>
            <option value="McCullough Student Center"> McCullough Student Center </option>
            <option value="Frog Hollow"> Frog Hollow </option>
          </FormControl>
        </FormGroup>

        <FormGroup controlId="destination">
          <ControlLabel>Select a Destination</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="Destination"
            value={this.state.destination}
            onChange={this.handleDestination}
          >
            <option value="select"> select </option>
            <option value="Adirondack Circle"> Adirondack Circle </option>
            <option value="Track Lot/KDR"> Track Lot/KDR </option>
            <option value="E Lot"> E Lot </option>
            <option value="R Lot"> R Lot </option>
            <option value="T Lot"> T Lot </option>
            <option value="Q Lot"> Q Lot </option>
            <option value="Robert A. Jones House"> Robert A. Jones House </option>
            <option value="McCullough Student Center"> McCullough Student Center </option>
            <option value="Frog Hollow"> Frog Hollow </option>
          </FormControl>
        </FormGroup>

        <Button id="btnSubmitRide" bsStyle="primary" disabled={this.state.name === '' || this.state.passengers === '' || this.state.currentLocation === '' || this.state.destination === '' || this.state.currentLocation === this.state.destination} onClick={this.handleSubmit}> Submit </Button>
        <Button id="btnCancel" onClick={this.handleCancel}> Cancel </Button>
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
