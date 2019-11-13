import React, { useContext, useState, useEffect } from 'react';
import AppBar from './AppBar'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Div } from '../StyledComponents'
const AppDialog = props => {
    return (
        <Dialog
            fullScreen={props.fullScreen}
            open={props.open}
            onClose={props.handleCancel} aria-labelledby="dialog-title">
            {props.title && <DialogTitle id="dialog-title">{props.title}</DialogTitle>}

            {props.fullScreen &&
                <AppBar contextBar={props.contextBar} />
            }

            <DialogContent>
                {props.text &&
                    <DialogContentText>
                        Please specify the dimensions of your new puzzle:
                    </DialogContentText>
                }
                {props.children}
            </DialogContent >
            {(!props.hideActions || props.actions !== undefined) &&
                <DialogActions>
                    {props.actions ?
                        props.actions

                        :
                        <>
                            <Button onClick={props.handleCancel} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={props.handleSave} color="secondary">
                                {props.saveText || 'Save'}
                            </Button>
                        </>
                    }

                </DialogActions>
            }
        </Dialog>
    );
}
export default AppDialog;