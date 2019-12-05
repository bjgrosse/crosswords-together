import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react'
import { Div } from '../../UI/StyledComponents/StyledComponents'
import { ListItem, Avatar } from '../../UI/MaterialComponents/MaterialComponents'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components'
import useSafeHandler, { useSafeHandlerWarn } from '../../Utility/useSafeHandler'
import AppDialog from '../../AppFrame/AppDialog';

const Progress = styled(CircularProgress)`${({ theme }) => `
&{
    color: ${theme.palette.secondary.main} !important;
    position: absolute;
}`
    }
`
const ProgressBackground = styled(CircularProgress)`${({ theme }) => `
& {
    color: ${theme.palette.secondary.light} !important;
    position: absolute;
}
`}
`

const CompletedIcon = styled(CheckIcon)`${({ theme }) => `
    && {
        font-size: 24px;
        font-weight: 800;
        color: ${theme.palette.common.white}
    }
`}
`

const PuzzleListItem = observer(props => {


    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const history = useHistory();
    function navigateTo(path) {
        history.push(path);
    }

    const handleClick = useSafeHandlerWarn(() => {

        if (props.puzzle.pendingInvitationId) {
            navigateTo(`/i/${props.puzzle.pendingInvitationId}`)

        } else {
            navigateTo(`/puzzle/${props.puzzle.id}`)
        }
    })

    const handleAccept = useSafeHandler(() => {
        props.puzzle.acceptInvitation()
    })


    const handleCancelDelete = useSafeHandler(() => {
        setShowConfirmDelete(false)
    })
    const handleDelete = useSafeHandler((puzzle) => {
        setShowConfirmDelete(true)
    })
    const handleConfirmDelete = useSafeHandler(() => {
        props.puzzle.delete()
    })


    return (
        <>
            <ListItem p={[1, 1, 2]} button alignItems="flex-start" onClick={handleClick}>
                <ListItemAvatar >
                    <Avatar bgcolor={props.puzzle.percentComplete < 100 ? 'secondary.light' : 'primary.light'} color="common.white">
                        {props.puzzle.percentComplete < 100 ?
                            (
                                props.puzzle.percentComplete == 0 ?
                                    <Div>NEW</Div>
                                    :
                                    <Progress variant="static" value={props.puzzle.percentComplete} max={100} thickness={22} />

                            )
                            :
                            <CompletedIcon />
                        }

                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={props.puzzle.title}
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                            >
                                {props.puzzle.players.map(user => user.name).join(", ")}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="close" onClick={handleDelete}>
                        <CloseIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <AppDialog
                handleCancel={handleCancelDelete}
                handleSave={handleConfirmDelete}
                open={showConfirmDelete}
                text="Leave this puzzle?"
                saveText="Yes" />
        </>
    );
})

export default PuzzleListItem;