import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PuzzleContext from '../CrosswordPuzzle/CrosswordPuzzleContext';

const AddPlayer = props => {
    const [state, setState] = useState({
                email: null,
        valid: true
    });
    const {puzzle} = useContext(PuzzleContext);

    const handleChange = (event) => {
        setState({email: event.target.value})
    }

    const handleClose = () => {
        props.handleClose()
    };

    
    const handleInvite = () => {
        if (!state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setState({valid: false})
            return;
        } 

        puzzle.addPlayer(state.email);
        
        props.handleClose()
    };

    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add a player</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the player's email address
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    error={!state.valid}
                    helperMessage={state.valie ? null : "Please enter a valid email address"}
                    value={state.email}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleInvite} color="primary">
                    Invite
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPlayer;
