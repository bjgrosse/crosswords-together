import React from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react'
import { Div } from '../StyledComponents/StyledComponents'
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components'
import {useSafeHandlerWarn} from '../Utility/useSafeHandler'

const Progress = styled(CircularProgress)`
    position: absolute;
`

const PuzzleListItem = observer(props => {


    const history = useHistory();
    function navigateTo(path) {
        history.push(path);
    }

    const handleClick = useSafeHandlerWarn(() => {
        navigateTo(`/puzzle/${props.puzzle.id}`)
    })

    return (
        <ListItem button alignItems="flex-start" onClick={handleClick}>
            <ListItemAvatar >
                <Div relative>
                    <Progress color="primary" variant="static" value={100} max={100} thickness={22} />
                    <Progress color="secondary" variant="static" value={props.puzzle.percentComplete} max={100} thickness={22} />

                </Div>
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

                {props.puzzle.pendingInvitationId &&
                    <Button color="secondary" variant="contained" onClick={() => props.puzzle.acceptInvitation()}>Accept</Button>
                }

                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
})

export default PuzzleListItem;