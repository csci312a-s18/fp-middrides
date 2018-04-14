/*
  Form implements a form for creating a new ride request or editing an existing
  one.
*/

import React, { Component } from 'react';
// import Proptypes from 'prop-types';
// import styled from 'styled-components';

// const FormContainer = styled.div`
// `;
//
// const NameInput = styled.input`
// `;
//
// const PassengersSelect = styled.select`
// `;
//
// const CurrentLocationSelect = styled.select`
// `;
//
// const DestinationSelect = styled.select`
// `;

class Form extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      passengers: '',
      currentLocation: '',
      destination: '',
    };

    // this.state = {
    //   name: props.request ? props.request.name : '',
    //   passengers: props.request ? props.request.passengers : '',
    //   currentLocation: props.request ? props.request.currentLocation : '',
    //   destination: props.request ? props.request.destination : '',
    // };

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

  handleSelect(listItem, event) {
    this.setState({ [listItem]: event.target.value });
  }

  handleSubmit() {
    this.setState({
      name: this.state.name,
      passengers: this.state.passengers,
      currentLocation: this.state.currentLocation,
      destination: this.state.destination,
    });
    // const newRequest = {
    //   name: this.state.name,
    //   passengers: this.state.passengers,
    //   currentLocation: this.state.currentLocation,
    //   destination: this.state.destination,
    // };
    // this.props.complete(newRequest);
  }

  handleCancel() {
    this.setState({
      name: '',
      passengers: '',
      currentLocation: '',
      destination: '',
    });
    // this.props.complete();
  }

  render() {
    const name = (<input
      type="text"
      size="45"
      value={this.state.name}
      placeholder="Name"
      onChange={this.handleName}
    />);

    // always parse value to int from string (parseInt())
    const passengers = (
      <select onChange={this.handlePassengers}>
        <option value="0" selected>0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>);

    const currentLocation = (
      <select onChange={this.handleCurrentLocation}>
        <option value="select a current location" selected>Select a current location</option>
        <option value="adirondack circle">Adirondack Circle</option>
        <option value="track lot/kdr">Track Lot/KDR</option>
        <option value="e lot">E Lot</option>
        <option value="r lot">R Lot</option>
        <option value="t lot">T Lot</option>
        <option value="q lot">Q Lot</option>
        <option value="robert a jones 59 house">Robert A Jones 59 House</option>
        <option value="mccullough student center">McCullough Student Center</option>
        <option value="frog hollow">Frog Hollow</option>
      </select>);

    const destination = (
      <select onChange={this.handleDestination}>
        <option value="select a destination" selected>Select a destination</option>
        <option value="adirondack circle">Adirondack Circle</option>
        <option value="track lot/kdr">Track Lot/KDR</option>
        <option value="e lot">E Lot</option>
        <option value="r lot">R Lot</option>
        <option value="t lot">T Lot</option>
        <option value="q lot">Q Lot</option>
        <option value="robert a jones 59 house">Robert A Jones 59 House</option>
        <option value="mccullough student center">McCullough Student Center</option>
        <option value="frog hollow">Frog Hollow</option>
      </select>);

    return (
      <div>
        {name} {passengers} {currentLocation} {destination}
        <div>
          <input type="button" disabled={this.state.name === '' || this.state.passengers === '' || this.state.passengers === '0' || this.state.currentLocation === '' || this.state.currentLocation === 'select a current location' || this.state.currentLocation === this.state.destination || this.state.destination === '' || this.state.destination === 'select a destination'} onClick={this.handleSubmit} value="Submit" />
          <input type="button" onClick={this.handleCancel} value="Cancel" />
        </div>
      </div>
    );
  }
}

export default Form;
