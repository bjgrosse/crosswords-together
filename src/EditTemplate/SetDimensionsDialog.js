import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Input from '@material-ui/core/Input';
import { Div } from '../StyledComponents'
import AppDialog from '../AppFrame/AppDialog'

const inputConfig = {
    step: 1,
    min: 4,
    max: 25,
    type: 'number'
}

const SetDimensionsDialog = props => {
    const [rows, setRows] = useState(15);
    const [columns, setColumns] = useState(15);

    const handleInputChange = event => {
        const newValue = event.target.value === '' ? '' : Number(event.target.value);

        if (event.target.id === 'rows') {
            setRows(newValue)
        } else {
            setColumns(newValue)
        }
    };

    const handleBlur = () => {
        if (rows < inputConfig.min) {
            setRows(inputConfig.min);
        } else if (rows > inputConfig.max) {
            setRows(inputConfig.max);
        }

        if (columns < inputConfig.min) {
            setColumns(inputConfig.min);
        } else if (columns > inputConfig.max) {
            setColumns(inputConfig.max);
        }
    };


    return (

        <AppDialog
            open={props.open}
            handleCancel={props.handleCancel}
            handleSave={() =>  props.handleSave(rows, columns)}
            title="Create new puzzle"
            text="Please specify the dimensions of your new puzzle:"
            saveText="Create">
            <Div inline mr={1}>Rows</Div>
            <Input
                id="rows"
                label="Rows"
                value={rows}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={inputConfig}
            />

            <Div inline ml={2} mr={1}>Columns</Div>
            <Input
                id="columns"
                label="Columns"
                value={columns}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={inputConfig}
            />

        </AppDialog>
        // <Dialog
        //     open={props.open}
        //     onClose={props.handleCancel}
        //     aria-labelledby="dialog-title">
        //     <DialogTitle id="dialog-title">Create new puzzle</DialogTitle>
        //     <DialogContent>
        //         <DialogContentText>
        //             Please specify the dimensions of your new puzzle:
        //             </DialogContentText>

        //         <Div inline mr={1}>Rows</Div>
        //         <Input
        //             id="rows"
        //             label="Rows"
        //             value={rows}
        //             margin="dense"
        //             onChange={handleInputChange}
        //             onBlur={handleBlur}
        //             inputProps={inputConfig}
        //         />

        //         <Div inline ml={2} mr={1}>Columns</Div>
        //         <Input
        //             id="columns"
        //             label="Columns"
        //             value={columns}
        //             margin="dense"
        //             onChange={handleInputChange}
        //             onBlur={handleBlur}
        //             inputProps={inputConfig}
        //         />

        //     </DialogContent>
        //     <DialogActions>
        //         <Button onClick={props.handleCancel} color="secondary">
        //             Cancel
        //             </Button>
        //         <Button onClick={() => props.handleSave(rows, columns)} color="secondary">
        //             Create
        //             </Button>
        //     </DialogActions>
        // </Dialog>
    );
}
export default SetDimensionsDialog;