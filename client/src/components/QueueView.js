/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentArea from './ContentArea';

class QueueView extends Component {
  constructor(props) {
    super(props);

    this.handleInactive = this.handleInactive.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInactive() {

  }

  handleDelete() {
    // Invoke this.props.deleteRequest(id)
  }

  render() {
    const headers = ['Name', 'Passengers', 'Current Location', 'Destination'];

    const Table = styled.table`
      border: 1px solid black;
      border-collapse: collapse;
      width: 90%;
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

    // we are in user mode
    if (this.props.mode === 'UserStart') {
      return (
        <Table>
          <thead>
            <tr>
              {headers.map(title =>
                <Th key={title}>{title}</Th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.requests.map(request => (
              <tr key={request._id}>
                <Td>{request.name}</Td>
                <Td>{request.passengers}</Td>
                <Td>{request.currentLocation}</Td>
                <Td>{request.destination}</Td>
              </tr>))}
          </tbody>
        </Table>
      );
      // we are in dispatcher mode
    } else if (this.props.mode === 'DispatcherMode') {
      return (
        <Table>
          <thead>
            <tr>
              {headers.map(title =>
                <Th key={title}>{title}</Th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.requests.map(request => (
              <tr key={request._id}>
                <Td>{request.name}</Td>
                <Td>{request.passengers}</Td>
                <Td>{request.currentLocation}</Td>
                <Td>{request.destination}</Td>
                <Td><input
                  type="button"
                  value="Inactive"
                  /* onClick={() => this.props.handleInactive(request._active)} */
                />
                  <input
                    type="button"
                    value="Delete"
                  />
                </Td>
              </tr>))}
          </tbody>
        </Table>
      );
    }
  }
}

QueueView.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    passengers: PropTypes.string,
    currentLocation: PropTypes.string,
    destination: PropTypes.string,
    active: PropTypes.bool,
  })).isRequired,
  viewmode: PropTypes.string,
};

export default QueueView;
