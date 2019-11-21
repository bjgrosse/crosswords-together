import React, { useContext, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LoadingContainer from '../AppFrame/LoadingContainer';
import CopyIcon from '@material-ui/icons/FileCopy';
import useSafeHandler from '../Utility/useSafeHandler';
import { IconButton } from '../UI/StyledComponents/MaterialComponents';
import { Div } from '../UI/StyledComponents/StyledComponents';
import * as clipboard from "clipboard-polyfill"


const AddPlayer = props => {
    const [link, setLink] = useState();
    const [linkCopied, setLinkCopied] = useState();


    const handleClose = () => {
        props.handleClose()
    };

    const handleCopy = useSafeHandler(async () => {
        clipboard.writeText(link)
            .then(() => setLinkCopied(true));

    })

    const getLinkId = () => {
        return props.puzzle.getInviteLink().then((link) => {
            setLink("https://crosswordstogether.com/i/" + link)
        });

    }

    return (
        <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">

            <LoadingContainer provideWorkPromise={getLinkId} message="Generating invitation...">
                <DialogContent>
                    <DialogContentText>
                        Copy this link and send it to your friends
                </DialogContentText>

                    <Div fullWidth flex>
                        <Div grow>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="link"
                                type="text"
                                fullWidth
                                value={link}
                                helperText={linkCopied ? "Link copied" : null}
                            />
                        </Div>
                        <Div>
                            <IconButton onClick={handleCopy}><CopyIcon color="secondary" /></IconButton>
                        </Div>
                    </Div>
                </DialogContent>

            </LoadingContainer>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddPlayer;
