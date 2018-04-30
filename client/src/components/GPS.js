import React, { Component } from 'react';
/* eslint-disable import/no-named-as-default */
import MapContainer from './Map';
// import geolocation from 'geolocation';

const options = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 0,
};

const latLngID = '5ae396ed734d1d133182d27a';
function updateLocation(latitude, longitude) {
  const newLocation = Object.assign({}, {
    _id: {
      $oid: latLngID,
    },
    latitude: null,
    longitude: null,
  }, { latitude, longitude });

  fetch(`/shuttleLocation/${latLngID}`, {
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

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function success(points) {
  updateLocation(points.coords.latitude, points.coords.longitude);
}

class GPS extends Component {
  constructor(props) {
    super(props);
    this.success = this.success.bind(this);
  }

  componentDidMount() {
    // change true to boolean for whether dispatcher account is open or not
    if (true) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(success, error, options);
      }, 1000);
    }
  }

  render() {
    return (
      <MapContainer />
    );
  }
}
export default GPS;
