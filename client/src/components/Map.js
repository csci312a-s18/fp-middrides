import React, { Component } from 'react';

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      lat: props.lat ? props.lat : 43.61,
      lng: props.lng ? props.lng : -73.19,
    }
  }
  render() {
    return (
      <Map google={this.props.google} initialCenter={{
            lat:this.state.lat, lng:this.state.lng
          }} zoom={14}>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyCsls1CEvSm07LGXVVt1xoTKeYY1dagA8k')
})(MapContainer)
