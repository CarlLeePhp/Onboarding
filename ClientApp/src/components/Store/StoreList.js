import React, { useState, useEffect, Fragment } from 'react';
import { Button, Icon, Table, Modal, Input, Pagination } from 'semantic-ui-react';

function StoreList() {

    const [pageNum, setPageNum] = useState(1);
    const [stores, setStores] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentStore, setCurrentStore] = useState({
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
        const response = await fetch('api/stores?pageNum=' + activePage);
        const data = await response.json();
        let pages = response.headers.get('TotalPages');
        setTotalPage(Number(pages));
        setStores(data);

    }

    const handlePageChange = (e, { activePage }) => {

        loadData(activePage);

    }

    const onChange = (e) => {
        setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
    }

    const newStore = () => {
        setCurrentStore({
            id: 0,
            name: '',
            address: ''
        });
        setOpenForm(true);
    }

    const editStore = (id) => {
        let targetStore = stores.filter(s => s.id === id);
        setCurrentStore(targetStore[0])
        setOpenForm(true)
    }

    const createStore = async () => {
        fetch('api/stores', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentStore)
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
                setCurrentStore({
                    id: 0,
                    name: '',
                    address: ''
                });
            })
    }

    const updateStore = async () => {
        fetch('api/stores/' + currentStore.id, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentStore)
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
                setCurrentStore({
                    id: 0,
                    name: '',
                    address: ''
                });
            })
    }

    const deleteStore = async (id) => {
        fetch('api/stores/' + id, {
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
            <Button color='blue' onClick={newStore}>New Store</Button>

            <Modal

                onClose={() => setOpenForm(false)}
                onOpen={() => setOpenForm(true)}
                open={openForm}
            >
                <Modal.Header>{currentStore.id === 0 ? 'Create' : 'Update'} Store</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>NAME:</p>
                        <Input name='name' onChange={onChange} value={currentStore.name} />
                        <p>ADDRESS:</p>
                        <Input name='address' onChange={onChange} value={currentStore.address} />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpenForm(false)}>
                        Cancel
                    </Button>
                    <Button color='green' onClick={currentStore.id === 0 ? createStore : updateStore}>
                        {currentStore.id === 0 ? 'Create' : 'Update'}
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
                    {stores.map(store =>
                        <Table.Row key={store.id}>
                            <Table.Cell>{store.name}</Table.Cell>
                            <Table.Cell>{store.address}</Table.Cell>
                            <Table.Cell>
                                <Button color='yellow' onClick={() => editStore(store.id)}>
                                    <Icon name='edit' />
                                    EDIT
                                </Button>
                                <Button color='red' onClick={() => deleteStore(store.id)}>
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

export default StoreList;