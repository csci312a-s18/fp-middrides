import React, { Component } from 'react';
import 'styled-components';


import UserView from './UserView';

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
    };
  }
  render() {
    if (this.state.viewmode === 'UserStart') {
      const userview = (<UserView
        changeView={() => this.setState({ viewmode: 'RequestRide' })}
      />);
      return (
        <div className="App">
          {userview}
        </div>
      );
    }
    // will change to else if (this.state.viewmode === 'RequestRide')
    return ('hello world');
    // show request form
    // this is where the request ride html elements should go
  }
}

export default ContentArea;
