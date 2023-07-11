import React, { useState, useEffect, Fragment } from 'react';
import ConfirmDelete from '../ConfirmDelete.js';
import DeleteError from '../DeleteError.js';
import { Button, Icon, Table, Modal, Pagination, Form } from 'semantic-ui-react';

function ProductList() {
  const pageSizes = [
    { key: 1, text: '10', value: 10 },
    { key: 2, text: '15', value: 15 },
    { key: 3, text: '20', value: 20 },
  ];
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [products, setProducts] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState({
    id: 0,
    name: '',
    price: 0.0
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
    const response = await fetch('api/products?pageNum=' + activePage + '&pageSize=' + changedSize);
    const data = await response.json();
    let pages = response.headers.get('TotalPages');
    setTotalPage(Number(pages));
    setProducts(data);

  }

  const handlePageChange = (e, { activePage }) => {

    loadData(pageSize, activePage);

  }

  const onChange = (e) => {
    setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
  }

  const initialCurrentProduct = () => {
    setCurrentProduct({
      id: 0,
      name: '',
      price: 0.0
    });
  }

  const newProduct = () => {
    initialCurrentProduct();
    setOpenForm(true);
  }

  const editProduct = (id) => {
    let targetProduct = products.filter(p => p.id === id);
    setCurrentProduct(targetProduct[0])
    setOpenForm(true)
  }

  const createProduct = async () => {
    fetch('api/products', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentProduct)
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
        initialCurrentProduct();
      })
  }

  const updateProduct = async () => {
    fetch('api/products/' + currentProduct.id, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentProduct)
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
        initialCurrentProduct();
      })
  }

  const confirmDelete = (id) => {
    let deleteProducts = products.filter(c => c.id === id);
    setCurrentProduct(deleteProducts[0]);
    setDeleteMessage('The product: ' + deleteProducts[0].name);
    setIsDelete(true);
  }

  const deleteProduct = async () => {
    fetch('api/products/' + currentProduct.id, {
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
    initialCurrentProduct();
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
      <Button color='blue' onClick={newProduct}>New Product</Button>

      <Modal

        onClose={() => setOpenForm(false)}
        onOpen={() => setOpenForm(true)}
        open={openForm}
        style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
      >
        <Modal.Header>{currentProduct.id === 0 ? 'Create' : 'Update'} Product</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>NAME:</label>
                <input name='name' onChange={onChange} value={currentProduct.name} />
              </Form.Field>
              <Form.Field>
                <label>PRICE:</label>
                <input type='number' name='price' onChange={onChange} value={currentProduct.price} />
              </Form.Field>
            </Form>


          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpenForm(false)}>
            Cancel
          </Button>
          <Button color='green' onClick={currentProduct.id === 0 ? createProduct : updateProduct}>
            {currentProduct.id === 0 ? 'Create' : 'Update'}
          </Button>
        </Modal.Actions>
      </Modal>

      <ConfirmDelete
        isDelete={isDelete}
        message={deleteMessage}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        confirmDelete={deleteProduct}
      />

      <DeleteError
        isDeleteError={isDeleteError}
        setDeleteErrorOpen={setDeleteErrorOpen}
      />

      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {products.map(product =>
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>$ {product.price}</Table.Cell>
              <Table.Cell>
                <Button color='yellow' onClick={() => editProduct(product.id)}>
                  <Icon name='edit' />
                  EDIT
                </Button>
                <Button color='red' onClick={() => confirmDelete(product.id)}>
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

export default ProductList;