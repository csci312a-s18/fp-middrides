/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';

const headers = ['Name', 'Passengers', 'Current Location', 'Destination', 'ETA', 'Set Status'];

function returnTime(date, eta) {
  let mins = ((date.getMinutes() + Math.round(eta)) % 60);
  if (mins.toString().length === 1) {
    mins = `0${mins.toString()}`;
  }
  const addToHour = Math.floor((date.getMinutes() + Math.round(eta)) / 60);
  const hour = (date.getHours() + addToHour) % 12;
  const time = `${hour}:${mins}`;
  return time;
}

function QueueView(props) {
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
            <td id="tdETA">{
              request.ETA === 100000 ? 'Calculating...' : (/* eslint-disable-line no-nested-ternary */
                request.ETA === -1 ? 'Picked Up' : returnTime(props.time, request.ETA))}
            </td>
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
  })).isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
};

export { returnTime };
export default QueueView;
