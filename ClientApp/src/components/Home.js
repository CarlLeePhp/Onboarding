import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div className="container">
        <h4>Hello,</h4>
        <h4>This is my Onboarding project.</h4>
        <h4>Front-end: React.</h4>
        <h4>UI library: semantic-ui-react.</h4>
        <h4>Back-end: ASP.Net Core.</h4>
        <br />
        <h4>Thanks for your visiting.</h4>
        <h4>Kunhui Li</h4>
      </div>
    );
  }
}
