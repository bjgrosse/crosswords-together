import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import Divider from '@material-ui/core/Divider';
import Player from './Player'
import AddPlayer from './AddPlayer'
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';


const Header = styled.div`
    color: #aaa;
    font-weight: 500;
    padding-left: 5px;
`

const ListBody = styled.div`
    border-radius: 5px;
    margin-top: 10px;
    background: white;
    box-shadow: 0px -2px 5px -2px #aaa, 0px 1px 1px 0px #ccc  ;
`
const MyAvatar = styled(Avatar)`
    && { margin-right: ${props => props.theme.spacing(1)}px;
    width: 24px;
    height: 24px;
    background: ${props => props.color}
    }
`

const PlayerList = observer(props => {
    const [state, setState] = React.useState({
        addPlayerOpen: false
    });

    const addPlayer = () => {
        setState({ addPlayerOpen: true })
    }

    const handleClose = () => {
        setState({ addPlayerOpen: false })
    }
    return (
        <>
            <List disablePadding>
                {props.puzzle.players.map(x => (
                    <Player key={x.id} player={x} puzzle={props.puzzle} />
                ))}
                {props.puzzle.canInvitePlayers &&
                    <>
                        <Divider />
                        <ListItem button dense onClick={addPlayer} >
                            <MyAvatar color="primary">
                                <AddIcon size="small" />
                            </MyAvatar>
                            <ListItemText>Add a player...</ListItemText>

                        </ListItem>
                    </>
                }
            </List>
            <AddPlayer puzzle={props.puzzle} open={state.addPlayerOpen} handleClose={handleClose} />
        </>
    );
})


export default PlayerList