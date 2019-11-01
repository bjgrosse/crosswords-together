import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';


import { AppContext } from './AppFrameContext';
import Menu from './AppMenu';
import Config from '../config';

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        textAlign: 'left',
        flexGrow: 1,
    }
}));

export default function (props) {
    const [state, setState] = useState({isMenuOpen: false});
    const history = useHistory();
    const classes = useStyles();
    const context = useContext(AppContext);

    function navigateTo(path) {
        history.push(path);
    }
    function goBack() {
        history.goBack();
    }
    function closeMenu() {
        setState({isMenuOpen: false})
    }
    function showMenu() {
        setState({isMenuOpen: true})
    }

    // If we're displaying in "contextual mode"
    if (context.contextBar) {
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
    
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={goBack}><BackIcon /></IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {context.contextBar.text}
                        </Typography>
                    </Toolbar>
                </AppBar>
    
            </div>
        );


        // Otherwise, just display the normal app bar
    } else {
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
    
                        {context.user ?
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={showMenu}><MenuIcon /></IconButton>
                            :
                            <Button color="inherit" className={classes.menuButton} aria-label="Log in" onClick={() => navigateTo('/login')} >Log in</Button>
                        }
                        <Typography variant="h6" className={classes.title}>
                            {Config.appName}
                        </Typography>
                    </Toolbar>
                </AppBar>
    
                <Menu isOpen={state.isMenuOpen} closeMenu={closeMenu} menuItems={props.menuItems} />
            </div>
        );
    }


}