import React, { Fragment, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as ScThemeProvider } from 'styled-components';

import { Route } from 'react-router-dom'

import * as firebase from 'firebase/app';
import AppFrame from './AppFrame/AppFrame';
import Login from './AppFrame/Login';
import Home from './Home/Home';
import Settings from './Settings/Settings';
import PlayPuzzle from './PlayPuzzle/PlayPuzzle';
import EditTemplate from './EditTemplate/EditTemplate'
import { TestPage1, TestPage2 } from './Temp/Temp'
import Theme from "./Theme/Theme"


import MenuItems from './MenuItems';
import { AppContext, AppContextManager } from './AppFrame/AppContext';
import './UI/Animations/Animations.css'
import StartNewPuzzle from './Home/StartNewPuzzle';


export default function (props) {
    function getRoutes() {
        return [
                <Route exact path='/' ><Home /></Route>,
                <Route path='/settings' ><Settings /></Route>,
                <Route path='/puzzles' ><Home /></Route>,
                <Route path='/start' ><StartNewPuzzle /></Route>,
                <Route path='/puzzle/:id' ><PlayPuzzle /></Route>,
                <Route path='/start-puzzle/:templateId' ><PlayPuzzle /></Route>,
                <Route path='/i/:id' ><PlayPuzzle isInvitation /></Route>,
                <Route path='/edit-template/:id' ><EditTemplate /></Route>,
                <Route path='/new-template/:rows/:columns' ><EditTemplate /></Route>,
                <Route path='/test1' ><TestPage1 /></Route>,
                <Route path='/test2' ><TestPage2 /></Route>
        ]

    }

    return (
        <ThemeProvider theme={Theme}>
            <ScThemeProvider theme={Theme}>
                <AppContextManager>
                    <AppFrame getRoutes={getRoutes} menuItems={MenuItems} />
                </AppContextManager>
            </ScThemeProvider>
        </ThemeProvider>
    )
}