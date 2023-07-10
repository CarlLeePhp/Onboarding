import React from 'react';

import { Button, Modal, Icon } from 'semantic-ui-react';
function ConfirmDelete(props) {

  return (
    <Modal
      onClose={() => props.setDeleteConfirmOpen(false)}
      onOpen={() => props.setDeleteConfirmOpen(true)}
      open={props.isDelete}
      style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
    >
      <Modal.Header>Do you want to delete:</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <h4>{props.message}</h4>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => props.setDeleteConfirmOpen(false)}>
          Cancel
        </Button>
        <Button color='green' onClick={props.confirmDelete}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default ConfirmDelete;
