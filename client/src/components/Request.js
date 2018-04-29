/*
  Request displays the name, number of passengers, current location and
  destination of a request passed down in its props.

  props:
    request: Request to display
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RequestContainer = styled.div`
`;

const RequestName = styled.div`
`;

const RequestPassengers = styled.div`
`;

const RequestCurrentLocation = styled.div`
`;

const RequestDestination = styled.div`
`;

const RequestActive = styled.div`
`;
export const RequestShape = PropTypes.shape({
  name: PropTypes.string,
  passengers: PropTypes.string, // needs to be converted to integer to be handled
  currentLocation: PropTypes.string,
  destination: PropTypes.string,
  active: PropTypes.string, // needs to be converted to boolean to be handled
  timestamp: PropTypes.string,
});

function Request(props) {
  return (
    <RequestContainer>
      <RequestName>{props.request.name}</RequestName>
      <RequestPassengers>{props.request.passengers}</RequestPassengers>
      <RequestCurrentLocation>{props.request.currentLocation}</RequestCurrentLocation>
      <RequestDestination>{props.request.destination}</RequestDestination>
      <RequestActive>{props.request.active}</RequestActive>
    </RequestContainer>
  );
}

Request.propTypes = {
  request: RequestShape.isRequired,
};

export default Request;
