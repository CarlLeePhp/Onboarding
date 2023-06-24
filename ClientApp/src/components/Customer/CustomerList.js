import React, { Component } from 'react';

export class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [
                { id: 1, name: 'Carl Li', address: 'Invercargill' },
                { id: 2, name: 'George Li', address: 'Invercargill' },
                { id: 3, name: 'Daniel Li', address: 'Invercargill' },
            ]
        };
        
    }
  render() {
    return (
      <div>
            <h1>Customer List Page</h1>
            <ul>
                {this.state.customers.map(customer =>
                    <li key={customer.id}>
                        {customer.name} - {customer.address}
                    </li>
                )}
            </ul>
      </div>
    );
  }
}
