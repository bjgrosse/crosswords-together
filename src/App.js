import React, { Fragment } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Route } from 'react-router-dom'

import AppFrame from './AppFrame/AppFrame';
import Home from './Home/Home';
import Settings from './Settings/Settings';
import PlayPuzzle from './PlayPuzzle/PlayPuzzle';
import Theme from "./Theme/Theme"

import MenuItems from './MenuItems';

export default function (props) {

    function getRoutes() {
        return (
            <Fragment>
                <Route exact path='/' ><Home /></Route>
                <Route path='/settings' ><Settings /></Route>
                <Route path='/puzzle/:id' ><PlayPuzzle /></Route>                
                <Route path='/invitation/:id' ><PlayPuzzle isInvitation /></Route>
            </Fragment>
        )
    }

    return <ThemeProvider theme={Theme}><AppFrame getRoutes={getRoutes} menuItems={MenuItems} /></ThemeProvider>
}