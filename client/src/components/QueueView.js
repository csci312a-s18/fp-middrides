/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class QueueView extends Component {
  constructor(props) {
    super(props);


    this.handleInactive = this.handleInactive.bind(this);

  }
  handleInactive(props) {
    if (this.props.currentRequest) {
      const updatedRequests = this.props.requests
        .filter(request => request._id == this.props.currentRequest._id);
    } else{
      const updatedRequests = this.props.requests
        .filter(request => request._id == this.props.requests.request._id);
    }
    const inactiveRequest = this.updatedRequests.request;
    this.inactiveRequest.active = 'Inactive';
    this.setState({ currentRequest: inactiveRequest });

    this.props.complete(inactiveRequest);
  }


  // handleCancel(props) {
  //   // Invoke this.props.deleteRequest(id)
  //   const cancelledRequest = Object.assign({}, this.props.currentRequest, { active: false });
  //   const updatedRequests = this.props.requests
  //     .filter(request => request._id !== this.state.currentRequest._id);
  //   this.props.requests(updatedRequests);
  //   }


  render() {
    const headers = ['Name', 'Passengers', 'Current Location', 'Destination', 'Status'];

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
                <Td>{request.active}</Td>
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
                <Td>{request.active}</Td>
                <Td><input
                  type="button"
                  onClick={() => this.handleInactive()}
                  value="Inactive"
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
    active: PropTypes.string,
  })).isRequired,
  viewmode: PropTypes.string,
  complete: PropTypes.func.isRequired,
};

export default QueueView;
