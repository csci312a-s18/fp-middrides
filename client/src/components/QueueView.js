/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const headers = ['Name', 'Passengers', 'Current Location', 'Destination', 'Status', 'ETA (mins)'];

const Table = styled.table`
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    margin: align-left;
  `;

const Td = styled.td`
    border: 1px solid black;
    height: 20px;
    vertical-align: bottom;
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  `;

const Th = styled.th`
    border: 1px solid black;
    height: 20px;
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    background-color: #4CAF50;
    color: white;
  `;


function QueueView(props) {
  // we are in user mode
  if (props.mode === 'UserStart') {
    return (
      <Table>
        <thead>
          <tr>
            {headers.map(title =>
              <Th key={title}>{title}</Th>)}
          </tr>
        </thead>
        <tbody>
          {props.requests.map(request => (
            <tr key={request._id}>
              <Td>{request.name}</Td>
              <Td>{request.passengers}</Td>
              <Td>{request.currentLocation}</Td>
              <Td>{request.destination}</Td>
              <Td>{request.active}</Td>
              <Td>{request.ETA}</Td>
            </tr>))}
        </tbody>
      </Table>
    );
    // we are in dispatcher mode
  }
  return (
    <Table>
      <thead>
        <tr>
          {headers.map(title =>
            <Th key={title}>{title}</Th>)}
        </tr>
      </thead>
      <tbody>
        {props.requests.map(request => (
          <tr key={request._id}>
            <Td>{request.name}</Td>
            <Td>{request.passengers}</Td>
            <Td>{request.currentLocation}</Td>
            <Td>{request.destination}</Td>
            <Td>{request.active}</Td>
            <Td>{request.ETA}</Td>
            <Td><input
              type="button"
              onClick={() => props.completeInactive(request._id)}
              value="Inactive"
            />
              <input
                type="button"
                onClick={() => props.completePickedUp(request._id)}
                value="Picked Up"
              />
            </Td>
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
