import React, { useContext, useState, useEffect } from 'react';
import { Div, Paper } from '../StyledComponents'
import CloseButton from "../CloseButton"
import posed, { PoseGroup } from 'react-pose'
import Scrum from '../Scrum/Scrum';
import styled from 'styled-components'

const DrawerDiv = posed(styled.div`
position: absolute;
left: ${({anchor}) => anchor === 'left' ? '0px' : 'unset'};
right: ${({anchor}) => anchor === 'right' ?  '0px' : 'unset'};
bottom: 0px;
top: 0px;
background: white;
box-shadow: 0px 0px 50px 0px rgb(0,0,0,.5)
`)({
    show: {
        x: 0,
        transition: { duration: 200, ease: 'easeIn' },
    },
    hide: {
        x: ({anchor}) => anchor === 'right' ? '100%' : '-100%',
        transition: { duration: 200, ease: 'easeOut' },
    }
})
const Drawer = props => {
    return (
        <Scrum show={props.open} onClick={props.onClose}>
            <DrawerDiv anchor={props.anchor} pose={props.open ? 'show' : 'hide'} className={props.className} >
                {props.children}
            </DrawerDiv>
        </Scrum>
    );
}
export default Drawer;