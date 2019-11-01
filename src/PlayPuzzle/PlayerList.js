import React, { useContext, useState, useEffect } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Player from './Player'
import AddPlayer from './AddPlayer'
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const List = styled.div`
    padding: 10px;    
    border-radius: 5px;
`

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
    && { margin: 10px;
    width: 24px;
    height: 24px;
    background: ${props => props.color}
    }
`

const PlayerList = props => {
    const [state, setState] = React.useState({
        addPlayerOpen: false
    });
    
    const addPlayer = () => {
        setState({addPlayerOpen: true})
    }

    const handleClose = () => {
        setState({addPlayerOpen: false})
    }
    return (
            <>
                <Header>Players</Header>
                <ListBody>
                    {props.players.map(x => (
                        <Player {...x} />
                    ))}
                    <Divider />
                    <ListItem button dense='true' disableGutters onClick={addPlayer} >
                        <MyAvatar color="primary">
                            <AddIcon size="small" />
                        </MyAvatar>
                        <ListItemText>Add a player...</ListItemText>
                    </ListItem>

                </ListBody>
                <AddPlayer open={state.addPlayerOpen} handleClose={handleClose} />
            </>
    );
}


export default PlayerList