
import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/Backspace';
import DownIcon from '@material-ui/icons/ExpandMore';

import './Keyboard.css';
export default function (props) {
    let letters = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    let rows = letters.map((row, index) => (
        <div style={{ marginLeft: (10 * index) + 'px' }}>
            <>
            {row.map(l => <Button className="Keyboard__LetterButton" color='inherit' onClick={() => props.handleKeyDown({ key: l })}>{l}</Button>)}
            {index==2 ? <IconButton className="Keyboard__LetterButton" color="inherit" aria-label="backspace" onClick={() => props.handleKeyDown({ key: 'Backspace' })} ><BackIcon /></IconButton> : null}
            </>
        </div>
    ));


    return (
        <Paper elevation="4" className="Keyboard__Panel" color="primary" >
            <div className="Keyboard__Container" >
                <Fragment>
                    {rows}
                    
                </Fragment>
            </div>
            <IconButton className="Keyboard__CloseButton" size="small" color="inherit" aria-label="close keyboard" onClick={props.closeKeyboard} ><DownIcon /></IconButton>
        </Paper>

    );
}