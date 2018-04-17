import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
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

// const requests = [];
// const req1 = {
//   id: 1,
//   from: 'Bihall',
//   to: 'Atwater',
//   count: 2,
//   completed: 'No',
// };
//
// const req2 = {
//   id: 2,
//   from: 'Proctor',
//   to: 'ADK',
//   count: 3,
//   completed: 'Yes',
// };
//
// const req3 = {
//   id: 3,
//   from: 'E lot',
//   to: 'Ridgeline',
//   count: 1,
//   completed: 'No',
// };
//
// requests.push(req1);
// requests.push(req2);
// requests.push(req3);

const headers = ['Id', 'Origin', 'Destination', '#people', 'Completed?'];

class QueueView extends Component {
  constructor() {
    super();
    this.state = {
      queue: [],
    };
  }

  setStatus(id, status) {
    const oldRequest = this.state.queue.find(request => id === request.id);
    const newRequest = Object.assign({}, oldRequest, { completed: status });

    fetch(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newRequest),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    }).then((updatedRequest) => {
      const updatedRequests = this.state.queue.map((request) => {
        if (request.id === updatedRequest.id) {
          return updatedRequest;
        }
        return request;
      });
      this.setState({ queue: updatedRequests });
    }).catch(err => console.log(err)); // eslint-disable-line no-console
  }

  componentDidMount() {
    // const newRequest = {id: 1, from: "ADK", to: "elot", count: 4, completed: 'No'};
    //
    // fetch('/requests', {
    //   method: 'POST',
    //   body: JSON.stringify(newRequest),
    //   headers: new Headers({
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   }),
    // }).then((response) => {
    //   if (!response.ok) {
    //     throw new Error(response.status_text);
    //   }
    //   return response.json();
    // });

    fetch('/requests', { headers: new Headers({ Accept: 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ queue: data });
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console

    this.setStatus(1, "Yes");
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
            <tr key={request.id}>
              <Td>{request.id}</Td>
              <Td>{request.from}</Td>
              <Td>{request.to}</Td>
              <Td>{request.count}</Td>
              <Td>{request.completed}</Td>
            </tr>))}
        </tbody>
      </Table>
    );
  }
}

export default QueueView;
