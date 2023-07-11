import React, { useState, useEffect, Fragment } from 'react';
import ConfirmDelete from '../ConfirmDelete.js';
import DeleteError from '../DeleteError.js';
import { Button, Icon, Table, Modal, Pagination, Form } from 'semantic-ui-react';

function CustomerList() {
  const pageSizes = [
    { id: 1, text: '10', value: 10 },
    { id: 2, text: '15', value: 15 },
    { id: 3, text: '20', value: 20 },
  ];
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customers, setCustomers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentCustomer, setCurrentCustomer] = useState({
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
    const response = await fetch('api/customers?pageNum=' + activePage + '&pageSize=' + changedSize);
    const data = await response.json();
    let pages = response.headers.get('TotalPages');
    setTotalPage(Number(pages));
    setCustomers(data);

  }

  const handlePageChange = (e, { activePage }) => {

    loadData(pageSize, activePage);

  }

  const onChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  }

  const initialCurrentCustomer = () => {
    setCurrentCustomer({
      id: 0,
      name: '',
      address: ''
    });
  }

  const newCustomer = () => {
    initialCurrentCustomer();
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
        initialCurrentCustomer();
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
        initialCurrentCustomer();
      })
  }

  const confirmDelete = (id) => {
    let deleteCustomers = customers.filter(c => c.id === id);
    setCurrentCustomer(deleteCustomers[0]);
    setDeleteMessage('The customer: ' + deleteCustomers[0].name);
    setIsDelete(true);
  }

  const deleteCustomer = async () => {
    fetch('api/customers/' + currentCustomer.id, {
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
        console.error(error)
        setDeleteErrorOpen(true);
      })
    initialCurrentCustomer();
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

      <ConfirmDelete
        isDelete={isDelete}
        message={deleteMessage}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={deleteCustomer}
      />

      <DeleteError
        isDeleteError={isDeleteError}
        setDeleteErrorOpen={setDeleteErrorOpen}
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
          {customers.map(customer =>
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.name}</Table.Cell>
              <Table.Cell>{customer.address}</Table.Cell>
              <Table.Cell>
                <Button color='yellow' onClick={() => editCustomer(customer.id)}>
                  <Icon name='edit' />
                  EDIT
                </Button>
                <Button color='red' onClick={() => confirmDelete(customer.id)}>
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

export default CustomerList;