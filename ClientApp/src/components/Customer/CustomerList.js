import React, { useState, useEffect, Fragment } from 'react';
import { Button, Icon, Table, Modal, Input, Grid } from 'semantic-ui-react';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState({
        id: 0,
        name: '',
        address: ''
    });
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        const response = await fetch('api/customers');
        const data = await response.json();
        
        setCustomers(data);
    }

    const onChange = (e) => {
        setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
    }

    const newCustomer = () => {
        setCurrentCustomer({
            id: 0,
            name: '',
            address: ''
        })
        setOpenForm(true);
    }

    const editCustomer = (id) => {
        let targetCustomer = customers.filter(c => c.id === id);
        setCurrentCustomer(targetCustomer[0])
        setOpenForm(true)
    }

    const createCustomer = async () => {
        fetch('api/customers', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentCustomer)
        })
            .then(response => {
                if (response.ok) {
                   return response.json();
                }
                throw response;
            })
            .then(data => {
                setCustomers([...customers, data]);
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setOpenForm(false)
            })
    }

    const updateCustomer = async () => {
        fetch('api/customers/' + currentCustomer.id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentCustomer)
        })
            .then(response => {
                if (response.ok) {
                    let updatedCustomers = customers.map(c => {
                        if (c.id === currentCustomer.id) {
                            return currentCustomer;
                        } else {
                            return c;
                        }
                    })
                    setCustomers(updatedCustomers)
                } else {
                    throw response;
                }
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setOpenForm(false)
            })
    }

    return (
        <Fragment>
            <Button color='blue' onClick={newCustomer}>New Customer</Button>
            
                <Modal
                    
                    onClose={() => setOpenForm(false)}
                    onOpen={() => setOpenForm(true)}
                    open={openForm}
                >
                    <Modal.Header>Create Customer</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p>NAME:</p>
                            <Input name='name' onChange={onChange} value={currentCustomer.name} />
                            <p>ADDRESS:</p>
                            <Input name='address' onChange={onChange} value={currentCustomer.address} />
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={() => setOpenForm(false)}>
                            Cancel
                        </Button>
                        <Button color='green' onClick={currentCustomer.id === 0 ? createCustomer : updateCustomer}>
                            {currentCustomer.id === 0 ? 'Create' : 'Update'}
                        </Button>
                    </Modal.Actions>
                </Modal>
            
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
                            <Table.Cell>
                                <Button color='yellow' onClick={() => editCustomer(customer.id)}>
                                    <Icon name='edit' />
                                    EDIT
                                </Button>
                                <Button color='red'>
                                    <Icon name='trash' />
                                    DELETE
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            
            
        </Fragment>
    );
}

export default CustomerList;