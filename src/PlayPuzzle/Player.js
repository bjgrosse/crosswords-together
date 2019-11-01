import React, { useContext, useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';
import styled from 'styled-components';
import Colors from '../Theme/Colors';

const MyAvatar = styled(Avatar)`
    && { margin: 10px;
    width: 24px;
    height: 24px;
    background: ${props => props.color}
    }
`

const Text = styled(ListItemText)`
    font-style: ${p => p.pending && 'italic' }
`
const Player = props => {
    const color = Colors[props.color][500]
    console.log(color)
    return (
        <ListItem dense='true' disableGutters>
            <MyAvatar color={color}>
                {props.pending ?
                    <MailIcon size="small" />
                    :
                    <PersonIcon size="small" />
                }
            </MyAvatar>
            <Text {...props} disabled={props.pending}>{props.name}</Text>
        </ListItem>
    );
}
export default Player