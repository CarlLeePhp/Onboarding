import React, { useState, useEffect, Fragment } from 'react';
import { Button, Icon, Table, Modal, Form, Input, Select, Pagination } from 'semantic-ui-react';

function SaleForm(props) {
  const [currentSale, setCurrentSale] = useState({
    id: 0,
    dateSold: '',
    storeId: 0,
    productId: 0,
    customerId: 0
  })

  useEffect(() => {
    setCurrentSale(props.currentSale);
  }, [])

  return (
    <Fragment>
      <Modal

        onClose={() => props.setEditOpen(false)}
        onOpen={() => props.setEditOpen(true)}
        open={props.isEdit}
        style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
      >
        <Modal.Header>Creat Product</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ul>
              {currentSale.id} - {currentSale.dateSold }
            </ul>


          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => props.setEditOpen(false)}>
            Cancel
          </Button>
          <Button color='green'>
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}

export default SaleForm;