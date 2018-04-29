import React, { Component } from 'react';
/* eslint-disable import/no-named-as-default */
import MapContainer from './Map';


class GPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
      latLngID: '5ae396ed734d1d133182d27a',
    };
    this.getLocation();
  }

  getLocation() {
    fetch(`/requests/${this.latLngID}`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ lat: data.latitude, lng: data.longitude });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    return (
      <MapContainer lat={this.state.lat} lng={this.state.lng} />
    );
  }
}
export default GPS;
