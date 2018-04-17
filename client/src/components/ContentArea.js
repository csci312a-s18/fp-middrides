import React, { Component } from 'react';
import styled from 'styled-components';

import QueueView from './QueueView';import RequestForm from './RequestForm';

const DivContainer = styled.div`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

class ContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewmode: 'UserStart',
      requests: [],
      currentRequest: null,
    };
  }

  handleFormReturn(newRequest) {
      if (newRequest) { // Not a cancel

        // if (this.state.currentArticle) { // Update existing article
        //   fetch(`/articles/${this.state.currentArticle._id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify(newArticle),
        //     headers: new Headers({ 'Content-type': 'application/json' }),
        //   }).then((response) => {
        //     if (!response.ok) {
        //       throw new Error(response.status_text);
        //     }
        //     return response.json();
        //   }).then((updatedArticle) => {
        //     const updatedCollection = this.state.collection.map((article) => {
        //       if (article._id === updatedArticle._id) {
        //         return updatedArticle;
        //       }
        //       return article;
        //     });
        //     this.setState({ collection: updatedCollection });
        //     this.setState({ currentArticle: updatedArticle });
        //   }).catch(err => console.log(err)); // eslint-disable-line no-console
        // } else { // Create new article
          fetch('/requests', {
            method: 'POST',
            body: JSON.stringify(newRequest),
            headers: new Headers({ 'Content-type': 'application/json' }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(response.status_text);
            }
            return response.json();
          }).then((createdRequest) => {
            const updatedRequests = this.state.requests;
            updatedRequests.push(createdRequest);
            this.setState({ requests: updatedRequests });
            // this.setState({ currentArticle: createdArticle });
          }).catch(err => console.log(err)); // eslint-disable-line no-console
        }

      // Switch to the user main view
      this.setState({ viewmode: 'UserStart'});
    }

  render() {
    if (this.state.viewmode === 'UserStart') {
      const gps = (
        <p>
          so this is where the gps and all them stuff goes u feel.
          theres gonna be a lil box here with a gps of the car u feel.
          we dont have none of that ready yet so this is it for now
        </p>);
      const queueview = (<QueueView
        requests={this.state.requests}
      />);
      const btnRequestRide = (<input
        type="button"
        value="Request Ride"
        onClick={() => this.setState({ viewmode: 'RequestRide' })}
      />);
      return (
        <DivContainer>
          {gps}
          {queueview}
          <br />
          {btnRequestRide}        </DivContainer>
      );
    }
    return (
      <RequestForm
        complete={(newRequest) => {this.handleFormReturn(newRequest); }}
      />
    );
  }
}

export default ContentArea;
