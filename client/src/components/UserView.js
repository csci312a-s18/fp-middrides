import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';



function UserView(props) {
  const { changeView }  = props;
  const btnRequestRide = (<input
    type="button"
    value="Request Ride"
    onClick={props.changeView}
    />);

  return (
    <div>
      <p>
      aiiiight so this is where the gps and all them stuff goes u feel.
      theres gonna be a lil box here with a gps of the car u feel.
      we dont have none of that ready yet so this is it for now
      </p>
      {btnRequestRide}
    </div>
  );
}


export default UserView;
