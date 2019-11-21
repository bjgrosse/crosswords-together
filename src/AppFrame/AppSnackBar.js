import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { AppContext } from './AppContext';
export const AppSnackBar = observer(props => {
    const context = useContext(AppContext)

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={context.store.snackBarMessage ? true : false}
            autoHideDuration={6000}
            onClose={context.store.closeSnackBar}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{context.store.snackBarMessage}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={context.store.closeSnackBar}
                >
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    );
})

export default AppSnackBar;