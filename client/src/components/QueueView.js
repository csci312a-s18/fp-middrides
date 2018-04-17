/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
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

class QueueView extends Component {
  constructor(props) {
    super();
    this.state = {
      queue: [],
    };
  }
  componentDidMount() {
    fetch('/requests', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(this.sortRequests);
        this.setState({ queue: sortedData });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  sortRequests(a, b) { // eslint-disable-line class-methods-use-this
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  }

  render() {
    return (
      <Table>
        <thead>
          <tr>
            {headers.map(title =>
              <Th key={title}>{title}</Th>)}
          </tr>
        </thead>
        <tbody>
          {this.state.queue.map(request => (
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
}

QueueView.propTypes = {
  requests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    count: PropTypes.string,
    completed: PropTypes.string,
  })).isRequired,
};

export default QueueView;
