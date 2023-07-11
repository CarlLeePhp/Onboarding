import React from 'react';

import { Button, Modal } from 'semantic-ui-react';
function DeleteError(props) {

  return (
    <Modal
      onClose={() => props.setDeleteErrorOpen(false)}
      onOpen={() => props.setDeleteErrorOpen(true)}
      open={props.isDeleteError}
      style={{ "position": "relative", "display": "block", height: "auto", justifyContent: "center", alignItems: "center" }}
    >
      <Modal.Header>Message</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <h4>Current item could not be deleted.</h4>
          <h4>Please check if any sale connecting with it.</h4>
          <h4>Or you can try it again later.</h4>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => props.setDeleteErrorOpen(false)}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteError;
