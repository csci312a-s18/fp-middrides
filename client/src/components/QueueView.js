/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';

const headers = ['Name', 'Passengers', 'Current Location', 'Destination', 'ETA (mins)', 'Set Status'];

function QueueView(props) {
  // we are in user mode
  if (props.mode === 'UserStart') {
    return (
      <Table>
        <thead>
          <tr>
            {headers.map(title =>
              <th key={title}>{title}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.requests.map(request => (
            <tr key={request._id}>
              <td>{request.name}</td>
              <td>{request.passengers}</td>
              <td>{request.currentLocation}</td>
              <td>{request.destination}</td>
              <td>{request.active}</td>
              <td>{request.ETA}</td>
            </tr>))}
        </tbody>
      </Table>
    );
    // we are in dispatcher mode
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {headers.map(title =>
            <th key={title}>{title}</th>)}
        </tr>
      </thead>
      <tbody id="tdBody">
        {props.requests.map(request => (
          <tr key={request._id}>
            <td id="tdName">{request.name}</td>
            <td id="tdpassengers">{request.passengers}</td>
            <td id="tdcurrentLocation">{request.currentLocation}</td>
            <td id="tddestination">{request.destination}</td>
            <td id="tdactive">{request.active}</td>
            <td id="tdETA">{request.ETA === 100000 ? 'Calculating...' : (request.ETA === -1 ? 'Picked Up' : request.ETA)}</td> {/* eslint-disable-line no-nested-ternary */}
            {request.isPickedUp ? (
              <td>
                <ButtonToolbar>
                  <Button
                    id="btnDropOff"
                    bsStyle="primary"
                    bsSize="small"
                    onClick={() => props.completeDroppedOff(request._id)}
                  >
                  Drop Off
                  </Button>
                  <Button
                    id="btnCancelPickUpRide"
                    bsStyle="danger"
                    bsSize="small"
                    bscolor="danger"
                    onClick={() => props.completeInactive(request._id)}
                  >
                  Cancel
                  </Button>
                </ButtonToolbar>
              </td>) : (
                <td>
                  <ButtonToolbar>
                    <Button
                      id="btnPickup"
                      bsStyle="primary"
                      bsSize="small"
                      disabled={request.isPickedUp === true}
                      onClick={() => props.completePickedUp(request._id)}
                    >
                    Pick Up
                    </Button>
                    <Button
                      id="btnCancleActiveRide"
                      bsStyle="danger"
                      bsSize="small"
                      onClick={() => props.completeInactive(request._id)}
                    >
                    Cancel
                    </Button>
                  </ButtonToolbar>
                </td>)}
          </tr>))}
      </tbody>
    </Table>
  );
}

QueueView.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    passengers: PropTypes.integer,
    currentLocation: PropTypes.string,
    destination: PropTypes.string,
    active: PropTypes.boolean,
  })).isRequired,
  mode: PropTypes.string.isRequired,
};

export default QueueView;
