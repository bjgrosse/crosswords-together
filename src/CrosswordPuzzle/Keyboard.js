
import React, { Fragment } from 'react';
// import { Paper } from '../StyledComponents/StyledComponents';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/Backspace';
import DownIcon from '@material-ui/icons/ExpandMore';
import { Paper, Div } from "../StyledComponents/StyledComponents"
import styled from 'styled-components'

import './Keyboard.css';

const Keyboard = styled(Paper)`
    z-index: 1;
    position: relative;
    display: flex;
    height: 100px;
`
const KeyContainer = styled(Div)`
    display: flex;
    flex-flow: nowrap column;
    width: 300px;
    min-width: 300px;
    flex-grow: 1;
    align-items: center;
`

const Row = styled(Div)`

`
const HideButton = styled(IconButton)`

`

export default function (props) {
    let letters = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    let rows = letters.map((row, index) => (
        <Row ml={index}>
            <>
            {row.map(l => <Button className="Keyboard__LetterButton" color='inherit' onClick={() => props.handleKeyDown({ key: l })}>{l}</Button>)}
            {index==2 ? <IconButton className="Keyboard__LetterButton" color="inherit" aria-label="backspace" onClick={() => props.handleKeyDown({ key: 'Backspace' })} ><BackIcon /></IconButton> : null}
            </>
        </Row>
    ));

    return (
        <Keyboard elevation={2} >
            <KeyContainer >
                <Fragment>
                    {rows}
                    
                </Fragment>
            </KeyContainer>
            <Divider height="100%" orientation="vertical" />
            <HideButton size="small" aria-label="close keyboard" onClick={props.closeKeyboard} ><DownIcon /></HideButton>
        </Keyboard>

    );
}