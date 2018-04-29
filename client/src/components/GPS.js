import React, { Component } from 'react';
/* eslint-disable import/no-named-as-default */
import MapContainer from './Map';
//import geolocation from 'geolocation';

const options = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 100,
};

class GPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lng: null,
      latLngID: '5ae396ed734d1d133182d27a',
    };
    navigator.geolocation.getCurrentPosition(this.success, this.error, options);
  }

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  updateLocation(latitude, longitude) {
    const newLocation = Object.assign({}, {
      "_id": {
          "$oid": this.state.latLngID
      },
      "latitude": null,
      "longitude": null
    }, { "latitude": latitude, "longitude": longitude });

    fetch(`/shuttleLocation/${this.state.latLngID}`, {
      method: 'PUT',
      body: JSON.stringify(newLocation),
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

  getLocation() {
    fetch(`/shuttleLocation`, { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ lat: data[0].latitude, lng: data[0].longitude });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  success(points) {
    this.updateLocation(points.coords.latitude, points.coords.longitude);
    this.getLocation();
  }

  render() {

    navigator.geolocation.getCurrentPosition(this.success, this.error, options);

    return (
      <MapContainer lat={this.state.lat} lng={this.state.lng} />
    );

  }
}
export default GPS;
