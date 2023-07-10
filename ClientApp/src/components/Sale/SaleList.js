import React, { useState, useEffect, Fragment } from 'react';
import ConfirmDelete from '../ConfirmDelete.js';
import { Button, Pagination, Modal, Form, Table, Icon } from 'semantic-ui-react';

function SaleList() {
  const pageSizes = [
    { id: 1, text: '10', value: 10 },
    { id: 2, text: '15', value: 15 },
    { id: 3, text: '20', value: 20 },
  ];
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);

  // Confirm Delete Component
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  // New or Edit modal switcher
  const [isEdit, setIsEdit] = useState(false);
  const setEditOpen = (isOpen) => {
    setIsEdit(isOpen);
  }

  const [currentSale, setCurrentSale] = useState({
    id: 0,
    storeId: 1,
    productId: 1,
    customerId: 1
  })


  useEffect(() => {
    initialData();
  }, []);

  const initialData = async () => {
    let storeId = 0;
    let productId = 0;
    let customerId = 0;
    let response = await fetch('api/stores?pageNum=1&pageSize=-1');
    let data = await response.json();
    setStores(data);
    storeId = data[0].id;

    response = await fetch('api/products?pageNum=1&pageSize=-1');
    data = await response.json();
    setProducts(data);
    productId = data[0].id;

    response = await fetch('api/customers?pageNum=1&pageSize=-1');
    data = await response.json();
    setCustomers(data);
    customerId = data[0].id

    setCurrentSale({
      id: 0,
      storeId: storeId,
      productId: productId,
      customerId: customerId
    })

    loadData(10, 1);
  }

  const initialCurrentSale = () => {
    setCurrentSale({
      id: 0,
      storeId: stores[0].id,
      productId: products[0].id,
      customerId: customers[0].id
    })
  }

  const loadData = async (changedSize, activePage) => {
    setPageNum(activePage);
    let response = await fetch('api/sales?pageNum=' + activePage + '&pageSize=' + changedSize);
    let data = await response.json();
    let pages = response.headers.get('TotalPages');
    setTotalPage(Number(pages));
    setSales(data);
  }

  const newSale = () => {
    initialCurrentSale();
    setEditOpen(true);
  }

  const editOnChange = (e) => {
    setCurrentSale({ ...currentSale, [e.target.name]: e.target.value });
  }

  const editSale = (id) => {
    let targetSales = sales.filter(s => s.id === id);
    let targetSale = {
      id: targetSales[0].id,
      storeId: targetSales[0].storeId,
      productId: targetSales[0].productId,
      customerId: targetSales[0].customerId
    }
    setCurrentSale(targetSale)
    setEditOpen(true)
  }

  const createSale = async () => {
    fetch('api/sales', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentSale)
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
        setEditOpen(false);
        initialCurrentSale();
      })
  }

  const updateSale = () => {
    fetch('api/sales/' + currentSale.id, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentSale)
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
        setEditOpen(false);
        initialCurrentSale();
      })
  }
  const confirmDelete = (id) => {
    let deleteSales = sales.filter(s => s.id === id);
    let deleteSale = {
      id: deleteSales[0].id,
      storeId: deleteSales[0].storeId,
      productId: deleteSales[0].productId,
      customerId: deleteSales[0].customerId
    }
    setCurrentSale(deleteSale);
    setDeleteMessage('Sale for the customer: ' + deleteSales[0].customerName
      + ' with the product: ' + deleteSales[0].productName
      + ' from the store: ' + deleteSales[0].storeName
    );
    setIsDelete(true);
  }
  const deleteSale = () => {
    fetch('api/sales/' + currentSale.id, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          loadData(pageSize, pageNum);
        } else {
          throw response;
        }

      })
      .catch(error => {
        console.error(error)
      })
    initialCurrentSale();
    setIsDelete(false);
  }

  const handlePageChange = (e, { activePage }) => {

    loadData(pageSize, activePage);

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
      <h4>Sale Page</h4>
      <Button color='blue' onClick={newSale}>New Sale</Button>
      <Modal
        onClose={() => setEditOpen(false)}
        onOpen={() => setEditOpen(true)}
        open={isEdit}
        style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
      >
        <Modal.Header>{currentSale.id === 0 ? 'Create' : 'Update'} Sale</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>STORE:</label>
                <select onChange={editOnChange} name='storeId' value={currentSale.storeId}>
                  {stores.map(store =>
                    <option key={store.id} value={store.id}>{store.name}</option>
                  )}
                </select>
              </Form.Field>
              <Form.Field>
                <label>PRODUCT:</label>
                <select onChange={editOnChange} name='productId' value={currentSale.productId}>
                  {products.map(product =>
                    <option key={product.id} value={product.id}>{product.name}</option>
                  )}
                </select>
              </Form.Field>
              <Form.Field>
                <label>CUSTOMER:</label>
                <select onChange={editOnChange} name='customerId' value={currentSale.customerId}>
                  {customers.map(customer =>
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  )}
                </select>
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button color='green' onClick={currentSale.id === 0 ? createSale : updateSale}>
            {currentSale.id === 0 ? 'Create' : 'Update'}
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmDelete
        isDelete={isDelete}
        message={deleteMessage}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={deleteSale}
      />
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Store</Table.HeaderCell>
            <Table.HeaderCell>Date Sold</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {sales.map(sale =>
            <Table.Row key={sale.id}>
              <Table.Cell>{sale.customerName}</Table.Cell>
              <Table.Cell>{sale.productName}</Table.Cell>
              <Table.Cell>{sale.storeName}</Table.Cell>
              <Table.Cell>{sale.dateSold}</Table.Cell>
              <Table.Cell>
                <Button color='yellow' onClick={() => editSale(sale.id)}>
                  <Icon name='edit' />
                  EDIT
                </Button>
                <Button color='red' onClick={() => confirmDelete(sale.id)}>
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
  )
}

export default SaleList;