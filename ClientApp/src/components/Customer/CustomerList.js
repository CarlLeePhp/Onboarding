import React, { useState, useEffect } from 'react';
import { Button, Table } from 'semantic-ui-react';

function CustomerList() {
    const [customers, setCustomers] = useState([
        { id: 1, name: 'Carl Li', address: 'Invercargill' },
        { id: 2, name: 'George Li', address: 'Invercargill' },
        { id: 3, name: 'Daniel Li', address: 'Invercargill' },
    ]);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        const response = await fetch('api/customers');
        const data = await response.json();
        console.log(data);
        setCustomers(data);
    }

    return (
        <div>
            <h1>Customers</h1>
            <Button color='blue' onClick={loadData}>Click Me</Button>
            <Table striped>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {customers.map(customer =>
                        <Table.Row key={customer.id}>
                            <Table.Cell>{customer.name}</Table.Cell>
                            <Table.Cell>{customer.address}</Table.Cell>
                            <Table.Cell><Button color='green'>Edit</Button></Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            
            
      </div>
    );
}

export default CustomerList;