import React, { useState, useEffect, Fragment } from 'react';
import ConfirmDelete from '../ConfirmDelete.js';
import DeleteError from '../DeleteError.js';
import { Button, Icon, Table, Modal, Form, Input, Pagination } from 'semantic-ui-react';

function StoreList() {
  const pageSizes = [
    { key: 1, text: '10', value: 10 },
    { key: 2, text: '15', value: 15 },
    { key: 3, text: '20', value: 20 },
  ];
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stores, setStores] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentStore, setCurrentStore] = useState({
    id: 0,
    name: '',
    address: ''
  });
  const [openForm, setOpenForm] = useState(false);

  // Confirm Delete Component
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  // Delete Error Component
  const [isDeleteError, setIsDeleteError] = useState(false);
  const setDeleteErrorOpen = (isOpen) => {
    setIsDeleteError(isOpen);
  }

  useEffect(() => {
    loadData(10, 1);
  }, [])

  const loadData = async (changedSize, activePage) => {
    setPageNum(activePage);
    const response = await fetch('api/stores?pageNum=' + activePage + '&pageSize=' + changedSize);
    const data = await response.json();
    let pages = response.headers.get('TotalPages');
    setTotalPage(Number(pages));
    setStores(data);

  }

  const handlePageChange = (e, { activePage }) => {

    loadData(pageSize, activePage);

  }

  const onChange = (e) => {
    setCurrentStore({ ...currentStore, [e.target.name]: e.target.value });
  }

  const initialCurrentStore = () => {
    setCurrentStore({
      id: 0,
      name: '',
      address: ''
    });
  }
  const newStore = () => {
    initialCurrentStore();
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
          loadData(pageSize, pageNum)
        } else {
          throw response;
        }

      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setOpenForm(false);
        initialCurrentStore();
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
          loadData(pageSize, pageNum)
        } else {
          throw response;
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setOpenForm(false);
        initialCurrentStore();
      })
  }

  const confirmDelete = (id) => {
    let deleteStores = stores.filter(c => c.id === id);
    setCurrentStore(deleteStores[0]);
    setDeleteMessage('The store: ' + deleteStores[0].name);
    setIsDelete(true);
  }

  const deleteStore = async () => {
    fetch('api/stores/' + currentStore.id, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          loadData(pageSize, 1);
        } else {
          throw response;
        }

      })
      .catch(error => {
        console.error(error);
        setDeleteErrorOpen(true);
      })
    initialCurrentStore();
    setIsDelete(false);
  }
  const changePageSize = (e) => {
    let changedSize = e.target.value
    changedSize = Number(changedSize)
    setPageSize(changedSize)
    loadData(changedSize, pageNum)
  }

  // Confirm Delete
  const setDeleteConfirmOpen = (isOpen) => {
    setIsDelete(isOpen);
  }

  return (
    <Fragment>
      <Button color='blue' onClick={newStore}>New Store</Button>

      <Modal

        onClose={() => setOpenForm(false)}
        onOpen={() => setOpenForm(true)}
        open={openForm}
        style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
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

      <DeleteError
        isDeleteError={isDeleteError}
        setDeleteErrorOpen={setDeleteErrorOpen}
      />

      <ConfirmDelete
        isDelete={isDelete}
        message={deleteMessage}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={deleteStore}
      />

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
                <Button color='red' onClick={() => confirmDelete(store.id)}>
                  <Icon name='trash' />
                  DELETE
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <div className='d-flex flex-row justify-content-between'>
        <Form>
          <Form.Field
            control='select'
            onChange={changePageSize}
          >
            {pageSizes.map((sizeOption) =>
              <option key={sizeOption.id} value={sizeOption.value}>{sizeOption.text}</option>
            )}
          </Form.Field>
        </Form>
        
        <Pagination
          activePage={pageNum}
          onPageChange={handlePageChange}
          totalPages={totalPage}
        />
      </div>
    </Fragment>
  );
}

export default StoreList;