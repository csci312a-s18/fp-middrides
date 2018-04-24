import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import MapContainer from './Map';

const Map = styled.div`
        height: 400px;
        width: 100%;
        `;

class GPS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat:44.0153,
      lng:-73.1673,
    };
  }

  render(){
    return(
    <MapContainer lat = {this.state.lat} lng = {this.state.lng}/>
  );}
}
export default GPS;

    /*
    // return (
    //   <Map />
    // )

    <html>
  <head>
    <title>Geolocation</title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"> </meta>
    <meta charset="utf-8"> </meta>
  </head>
  <body>
    <div id="map"></div>
    <script langauge='javascript' type='text/javascript'>
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
      });
      infoWindow = new google.maps.InfoWindow;

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent('Location found.');
          infoWindow.open(map);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
    </script>
    <script async defer
    src=process.env.GOOGLEAPI_KEY>
    </script>
  </body>
</html>

    // return(
    //
    //
    //   <html>
    //       <body>
    //       <div id="map"></div>
    //       <script>
    //       var map, marker, location;
    //       function initMap() {
    //
    //          map = new google.maps.Map(REA, {
    //           zoom: 4,
    //           center : location
    //         })
    //
    //          marker = new google.maps.Marker({
    //           position: location,
    //           map: map
    //         });
    //
    //       }
    //                 </script>
    //       <script async defer
    //         src={process.env.GOOGLEAPI_KEY}>
    //       </script>
    //     </body>
    //   </html>
    //
    // );
*/
