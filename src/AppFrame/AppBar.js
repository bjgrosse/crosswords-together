import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';

import Menu from './AppMenu';
import Config from '../config';
import { Div, Paper } from '../StyledComponents/StyledComponents';
import { AppBar, AppBarTitle } from '../StyledComponents/AppFrameComponents';
import { IconButton } from '../StyledComponents/MaterialComponents';

const contentRef = React.createRef();
const actionsRef = React.createRef();

export default function (props) {
    const [state, setState] = useState({ isMenuOpen: false });
    const history = useHistory();

    console.log("context bar", props.contextBar)
    function navigateTo(path) {
        history.push(path);
    }
    function goBack() {
        if (props.contextBar && props.contextBar.handleBack) {
            props.contextBar.handleBack()
        } else {
            props.handleBack()
        }
    }
    function closeMenu() {
        setState({ isMenuOpen: false })
    }
    function showMenu() {
        setState({ isMenuOpen: true })
    }

    useEffect(() => {
        if (props.setContentNodeRef && contentRef.current) {
            props.setContentNodeRef(contentRef)
        }
        if (props.setActionsNodeRef && actionsRef.current) {
            props.setActionsNodeRef(actionsRef)
        }
    })

    // If we're displaying in "contextual mode"
    if (props.contextBar) {
        return (
            <div >
                <AppBar position="static" >
                    <IconButton size="small" color="textPrimary" aria-label="menu" onClick={goBack}><BackIcon /></IconButton>
                    <Div grow ref={contentRef}>
                        <AppBarTitle >
                            {props.contextBar.textRender !== undefined ?
                                props.contextBar.textRender()
                                :
                                props.contextBar.text
                            }
                        </AppBarTitle>
                    </Div>
                    <Div ref={actionsRef}> 
                    </Div>
                </AppBar>

            </div>
        );


        // Otherwise, just display the normal app bar
    } else {
        return (
            <div>
                <AppBar position="static">
                    <AppBarTitle >
                        {Config.appName}
                    </AppBarTitle>
                </AppBar>

                <Menu isOpen={state.isMenuOpen} closeMenu={closeMenu} menuItems={props.menuItems} />
            </div>
        );
    }


}