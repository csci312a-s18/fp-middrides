import React, { Component } from 'react';
/* eslint-disable import/no-named-as-default */
import MapContainer from './Map';


class GPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 44.0153,
      lng: -73.1673,
    };
  }

  render() {
    return (
      <MapContainer lat={this.state.lat} lng={this.state.lng} />
    );
  }
}
export default GPS;
