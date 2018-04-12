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
      {btnRequestRide}
    </div>
  );
}



export default UserView
