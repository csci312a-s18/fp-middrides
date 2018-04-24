import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '100%',
  height: '400px',
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.lat ? props.lat : 44.0153,
      lng: props.lng ? props.lng : -73.1673,
    };
  }
  render() {
    return (
      <Map
        google={this.props.google}
        initialCenter={{
            lat: this.state.lat, lng: this.state.lng,
          }}
        style={style}
        zoom={14}
      >
        <Marker
          onClick={this.onMarkerClick}
          name="Current location"
        />

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCsls1CEvSm07LGXVVt1xoTKeYY1dagA8k'),
})(MapContainer);

MapContainer.propTypes = {
  lat: PropTypes.string.isRequired,
  lng: PropTypes.string.isRequired,
  google: PropTypes.string.isRequired,
};
