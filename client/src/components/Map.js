import React, { Component } from 'react';
// import PropTypes from 'prop-types';
/* eslint-disable react/prop-types */

import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '80%',
  height: '400px',
  position: 'contained',
};

const middleburyLatLong = { lat: 44.0153, lng: -73.1673 };

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.getLocation();
    }, 1000);
  }

  getLocation() {
    fetch('/shuttleLocation', { headers: new Headers({ Accept: 'application/json' }) })
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

  render() {
    if (this.props.show) {
      return (
        <Map
          google={this.props.google}
          initialCenter={{
              lat: middleburyLatLong.lat, lng: middleburyLatLong.lng,
            }}
          style={style}
          zoom={14}
        >
          <Marker
            name="Current location"
            position={{ lat: this.state.lat, lng: this.state.lng }}
          />
        </Map>
      );
    }

    return null;
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvOrHV6khC62g8fEuiExotGDSVBBGxPOA', // migrate hardcode to => process.env.GOOGLEAPI_KEY when done with project
})(MapContainer);

// MapContainer.propTypes = {
//   show: PropTypes.boolean.isRequired, // eslint-disable-line react/no-typos
//   google: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
// };
