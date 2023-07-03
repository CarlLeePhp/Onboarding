import React, { useState, useEffect, Fragment } from 'react';
import { Button, Icon, Table, Modal, Pagination, Form } from 'semantic-ui-react';

function CustomerList() {
    
    const [pageNum, setPageNum] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentCustomer, setCurrentCustomer] = useState({
        id: 0,
        name: '',
        address: ''
    });
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        loadData(1);
    }, [])

    const loadData = async (activePage) => {
        setPageNum(activePage);
        const response = await fetch('api/customers?pageNum=' + activePage);
        const data = await response.json();
        let pages = response.headers.get('TotalPages');
        setTotalPage(Number(pages));
        setCustomers(data);
        
    }

    const handlePageChange = (e, { activePage }) => {
        
        loadData(activePage);
  
    }

    const onChange = (e) => {
        setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
    }

    const newCustomer = () => {
        setCurrentCustomer({
            id: 0,
            name: '',
            address: ''
        });
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
                    loadData(pageNum)
                } else {
                    throw response;
                }
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setOpenForm(false);
                setCurrentCustomer({
                    id: 0,
                    name: '',
                    address: ''
                });
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
                    loadData(pageNum)
                } else {
                    throw response;
                }
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setOpenForm(false);
                setCurrentCustomer({
                    id: 0,
                    name: '',
                    address: ''
                });
            })
    }

    const deleteCustomer = async (id) => {
        fetch('api/customers/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    loadData(1);
                } else {
                    throw response;
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    return (
        <Fragment>
            <Button color='blue' onClick={newCustomer}>New Customer</Button>
            
                <Modal
                    
                    onClose={() => setOpenForm(false)}
                    onOpen={() => setOpenForm(true)}
                    open={openForm}
                    style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
                >
                    <Modal.Header>Create Customer</Modal.Header>
                    <Modal.Content>
                    <Modal.Description>
                    <Form>
                        <Form.Field>
                            <label>NAME:</label>
                            <input name='name' onChange={onChange} value={currentCustomer.name} />
                        </Form.Field>
                        <Form.Field>
                            <label>ADDRESS:</label>
                            <input name='address' onChange={onChange} value={currentCustomer.address} />
                        </Form.Field>
                        </Form>        
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
                                <Button color='red' onClick={() => deleteCustomer(customer.id)}>
                                    <Icon name='trash' />
                                    DELETE
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            <Pagination
                activePage={pageNum}
                onPageChange={handlePageChange}
                totalPages={totalPage}
            />
            
        </Fragment>
    );
}

export default CustomerList;