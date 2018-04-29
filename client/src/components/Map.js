import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '80%',
  height: '400px',
};

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: props.lat,
      lng: props.lng,
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
  apiKey: 'AIzaSyAvOrHV6khC62g8fEuiExotGDSVBBGxPOA', // migrate hardcode to => process.env.GOOGLEAPI_KEY when done with project
})(MapContainer);

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  google: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};
