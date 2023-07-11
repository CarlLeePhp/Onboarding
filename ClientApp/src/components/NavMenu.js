import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { Menu } from 'semantic-ui-react'

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Menu size='massive'>
          <Menu.Item>
            <Link to='/'><strong>Onboarding</strong></Link>
          </Menu.Item>

          <Menu.Item>
            <Link to='/customer'>Customer</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/store'>Store</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/sale'>Sale</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/product'>Product</Link>
          </Menu.Item>
        </Menu>
      </header>
    );
  }
}
