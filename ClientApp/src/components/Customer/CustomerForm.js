import React, { useState, useEffect } from 'react';
import { Button,  Modal } from 'semantic-ui-react';

function CustomerForm(props) {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState({
        id: 0,
        name: '',
        address: ''
    });
    const [openForm, setOpenForm] = useState(false);
    

    

    const newCustomer = () => {
        setOpenForm(true);
    }

    return (
        <Modal
            size='small'
            onClose={() => setOpenForm(false)}
            onOpen={() => setOpenForm(true)}
            open={openForm}
            trigger={<Button>New Customer</Button> }
        >
            <Modal.Header>Create Customer</Modal.Header>
            <Modal.Content>
                Description Here
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpenForm(false)}>
                    Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default CustomerForm;