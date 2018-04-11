import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const HorizontalUL = styled.ul`
  list-style:none;
`;

const ViewHeader = styled.li`
  display:inline;
  padding: 20px;
  font-weight: bold;
`;

const requests = [];
const req1 = {
  id: 1,
  from: 'Bihall',
  to: 'Atwater',
  count: 2,
};

const req2 = {
  id: 1,
  from: 'Proctor',
  to: 'ADK',
  count: 3,
};

requests.push(req1);
requests.push(req2);

function QueueViewHeader() {
  const items = ['Id', 'Origin', 'Destination', '#people'];
  const sectionItems = items.map(section => (
    <ViewHeader key={section}>{section}</ViewHeader>
  ));
  return (
    <div>
      <HorizontalUL>{sectionItems}</HorizontalUL>
    </div>
  );
}

class QueueView extends Component {
  constructor() {
    super();
    this.state = {
      queue: requests,
    };
  }

  render() {
    const queueHeader = (<QueueViewHeader />);
    const requestList = this.state.queue.map(section => (
      <ViewHeader key={section}>
        {section.id} {section.from} {section.to} {section.count}
        <br />
      </ViewHeader>
    ));
    return (
      <div>
        {queueHeader}
        <HorizontalUL>{requestList}</HorizontalUL>
      </div>
    );
  }
}

export default QueueView;
