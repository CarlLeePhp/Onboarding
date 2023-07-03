import React, { Component, Fragment } from 'react';
// import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import { Container } from 'semantic-ui-react';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <Fragment>
        <NavMenu />
            <Container className='mt-2'>
          {this.props.children}
        </Container>
      </Fragment>
    );
  }
}
