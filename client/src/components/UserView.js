import React, { } from 'react';
import 'styled-components';
import PropTypes from 'prop-types';


function UserView(props) {
  const { changeView } = props;
  const btnRequestRide = (<input
    type="button"
    value="Request Ride"
    onClick={changeView}
  />);

  return (
    <div>
      {btnRequestRide}
    </div>
  );
}

UserView.propTypes = {
  changeView: PropTypes.func.isRequired,
};

export default UserView;
