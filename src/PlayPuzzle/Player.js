import React, { useContext, useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/MoreVert';
import PersonIcon from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';
import styled from 'styled-components';
import Colors from '../Theme/Colors';

const Action = styled(ListItemSecondaryAction)`
    display: block;
    opacity: 0
    transition: opacity .3s cubic-bezier(0.0, 0.0, 0.2, 1);
    &:hover  {
        opacity: 1
 }
`
const Item = styled(ListItem)`
    &:hover + ${Action} {
        display: block;
        opacity: 1
 }
`

const MyAvatar = styled(Avatar)`
    && { 
        margin-right: ${props => props.theme.spacing(1)}px;
    width: 24px;
    height: 24px;
    background: ${props => props.color}
    }
`


const Text = styled(ListItemText)`
    font-style: ${props => props.pending ? 'italic' : undefined};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`
const Player = props => {
    const color = Colors[props.player.color][500]
    return (
        <Item dense>
            <MyAvatar color={color}>
                {props.player.pending ?
                    <MailIcon size="small" />
                    :
                    <PersonIcon size="small" />
                }
            </MyAvatar>
            <Text {...props} title={props.player.name}>{props.player.name}</Text>

            {(props.player.isCurrentUser || props.puzzle.canManagePlayers) &&
                <Action>

                    <IconButton size="small" edge="end" aria-label="delete">
                        <MenuIcon />
                    </IconButton>
                </Action>
            }
        </Item>
    );
}
export default Player