/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  width: 80%;
  margin: align-left;
`;

const Td = styled.td`
  border: 1px solid black;
  height: 50px;
  vertical-align: bottom;
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const Th = styled.th`
  border: 1px solid black;
  height: 50px;
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  background-color: #4CAF50;
  color: white;
`;

const headers = ['Name', 'Passengers', 'Current Location', 'Destination'];

function QueueView(props) {
  return (
    <Table>
      <thead>
        <tr>
          {headers.map(title =>
            <Th key={title}>{title}</Th>)}
        </tr>
      </thead>
      <tbody>
        {props.queue.map(request => (
          <tr key={request._id}>
            <Td>{request.name}</Td>
            <Td>{request.passengers}</Td>
            <Td>{request.currentLocation}</Td>
            <Td>{request.destination}</Td>
          </tr>))}
      </tbody>
    </Table>
  );
}

QueueView.propTypes = {
  queue: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    passengers: PropTypes.string,
    currentLocation: PropTypes.string,
    destination: PropTypes.string,
    active: PropTypes.bool,
  })).isRequired,
};

export default QueueView;
