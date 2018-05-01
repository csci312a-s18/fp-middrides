/*
  RequestForm implements a form for creating a new ride request or editing an existing
  one.

  props:
    request: The request to be edited [optional]
    complete: A callback to submit a new or edited request
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { RequestShape } from './Request';

const RequestFormContainer = styled.div`
`;

const ButtonBar = styled.div`
`;

const NameInput = styled.input`
`;

const PassengersSelect = styled.select`
`;

const CurrentLocationSelect = styled.select`
`;

const DestinationSelect = styled.select`
`;

const Option = styled.option`
`;

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
      passengers: this.state.passengers,
      currentLocation: this.state.currentLocation,
      destination: this.state.destination,
      active: true,
      isPickedUp: false,
      timestamp: now.toISOString(),
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
    const name = (<NameInput
      type="text"
      value={this.state.name}
      placeholder="Name"
      onChange={this.handleName}
    />);

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];

    const passengerOptions = numbers.map(number => (
      <Option key={number} value={number}>
        {number}
      </Option>
    ));

    // always parse value to int from string (parseInt())
    const passengers = (
      <PassengersSelect value={this.state.passengers} onChange={this.handlePassengers}>
        <option value="" disabled hidden>0</option>
        {passengerOptions}
      </PassengersSelect>);

    const stops = ['Adirondack Circle', 'Track Lot/KDR', 'E Lot', 'R Lot', 'T Lot', 'Q Lot', 'Robert A Jones \'59 House', 'McCullough Student Center', 'Frog Hollow'];

    const stopOptions = stops.map(stop => (
      <Option key={stop} value={stop}>
        {stop}
      </Option>
    ));

    const currentLocation = (
      <CurrentLocationSelect
        value={this.state.currentLocation}
        onChange={this.handleCurrentLocation}
      >
        <option value="" disabled hidden>Select a current location</option>
        {stopOptions}
      </CurrentLocationSelect>);

    const destination = (
      <DestinationSelect value={this.state.destination} onChange={this.handleDestination}>
        <option value="" disabled hidden>Select a destination</option>
        {stopOptions}
      </DestinationSelect>);

    const submitButton = <input type="button" disabled={this.state.name === '' || this.state.passengers === '' || this.state.currentLocation === '' || this.state.destination === '' || this.state.currentLocation === this.state.destination} onClick={this.handleSubmit} value="Submit" />;

    const cancelButton = <input type="button" onClick={this.handleCancel} value="Cancel" />;

    return (
      <RequestFormContainer>
        {name} {passengers} {currentLocation} {destination}
        <ButtonBar>{submitButton} {cancelButton}</ButtonBar>
      </RequestFormContainer>
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
