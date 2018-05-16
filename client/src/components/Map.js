import React, { Component } from 'react';
// import PropTypes from 'prop-types';
/* eslint-disable react/prop-types */

import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Grid, Col } from 'react-bootstrap';

const style = {
  height: '380px',
  position: 'contained',
  width: '100%',
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
        <Grid id="grid">
          <Col>
            <Map
              id="map"
              google={this.props.google}
              initialCenter={{
                lat: middleburyLatLong.lat, lng: middleburyLatLong.lng,
              }}
              style={style}
              zoom={14}
            >
              <Marker
                id="marker"
                name="Current location"
                position={{ lat: this.state.lat, lng: this.state.lng }}
              />
            </Map>
          </Col>
        </Grid>
      );
    }

    return null;
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLEAPI_KEY,
})(MapContainer);

// MapContainer.propTypes = {
//   show: PropTypes.boolean.isRequired, // eslint-disable-line react/no-typos
//   google: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
// };
