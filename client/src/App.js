import React from 'react';
import styled from 'styled-components';

import QueueView from './components/QueueView';

const CenteredTitle = styled.h1`
  text-align: center;
`;

function App() {
  return (
    <div className="App">
      <CenteredTitle>MiddRides Queue</CenteredTitle>
      <QueueView />
    </div>
  );
}

export default App;
