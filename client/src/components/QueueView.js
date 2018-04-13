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

const requests = [];
const req1 = {
  id: 1,
  from: 'Bihall',
  to: 'Atwater',
  count: 2,
  completed: 'No',
};

const req2 = {
  id: 2,
  from: 'Proctor',
  to: 'ADK',
  count: 3,
  completed: 'Yes',
};

const req3 = {
  id: 3,
  from: 'E lot',
  to: 'Ridgeline',
  count: 1,
  completed: 'No',
};

requests.push(req1);
requests.push(req2);
requests.push(req3);

// function QueueViewHeader() {
//   const items = ['Id', 'Origin', 'Destination', '#people'];
//   const sectionItems = items.map(section => (
//     <ViewHeader key={section}>{section}</ViewHeader>
//   ));
//   return (
//     <div>
//       <HorizontalUL>{sectionItems}</HorizontalUL>
//     </div>
//   );
// }

const headers = ['Id', 'Origin', 'Destination', '#people', 'Completed?'];

class QueueView extends Component {
  constructor() {
    super();
    this.state = {
      queue: requests,
    };
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
          {this.state.queue.map(request =>
            <tr key={request.id}>
              <Td>{request.id}</Td>
              <Td>{request.from}</Td>
              <Td>{request.to}</Td>
              <Td>{request.count}</Td>
              <Td>{request.completed}</Td>
            </tr>)}
        </tbody>
      </Table>
    );
  }
}

  // render() {
  //
  //   const queueHeader = (<QueueViewHeader />);
  //   const requestList = this.state.queue.map(section => (
  //     <ViewHeader key={section}>
  //       {section.id}     {section.from}     {section.to}     {section.count}
  //       <br />
  //     </ViewHeader>
  //   ));
  //   return (
  //     <div>
  //       {queueHeader}
  //       <HorizontalUL>{requestList}</HorizontalUL>
  //     </div>
  //   );
  // }
// }

export default QueueView;
