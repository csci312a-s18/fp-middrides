/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';

const headers = ['Name', 'Passengers', 'Current Location', 'Destination', 'Status', 'ETA (mins)', 'Set Status'];

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
      <tbody>
        {props.requests.map(request => (
          <tr key={request._id}>
            <td>{request.name}</td>
            <td>{request.passengers}</td>
            <td>{request.currentLocation}</td>
            <td>{request.destination}</td>
            <td>{request.active}</td>
            <td>{request.ETA}</td>
            <td>
            <ButtonToolbar>
              <Button
                bsStyle="primary"
                bsSize="small"
                onClick={() => props.completeInactive(request._id)}
              >
              Inactive
              </Button>

              <Button
                bsStyle="primary"
                bsSize="small"
                onClick={() => props.completePickedUp(request._id)}
              >
              Picked Up
              </Button>
              </ButtonToolbar>
            </td>
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
