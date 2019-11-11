import React, { Fragment, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as ScThemeProvider } from 'styled-components';

import { Route } from 'react-router-dom'

import AppFrame from './AppFrame/AppFrame';
import Home from './Home/Home';
import Settings from './Settings/Settings';
import PlayPuzzle from './PlayPuzzle/PlayPuzzle';
import EditTemplate from './EditTemplate/EditTemplate'
import { TestPage1, TestPage2 } from './Temp/Temp'
import Theme from "./Theme/Theme"

import MenuItems from './MenuItems';

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

export default function (props) {
    useEffect(()=> {
        // hack to auto hide the address bar
        console.log('scroll hack')
        //toggleFullScreen()
    },[])

    function getRoutes() {
        return (
            <Fragment>
                <Route exact path='/' ><Home /></Route>
                <Route path='/settings' ><Settings /></Route>
                <Route path='/puzzles' ><Home /></Route>
                <Route path='/puzzle/:id' ><PlayPuzzle /></Route>
                <Route path='/start-puzzle/:templateId' ><PlayPuzzle /></Route>
                <Route path='/invitation/:id' ><PlayPuzzle isInvitation /></Route>
                <Route path='/edit-template/:id' ><EditTemplate /></Route>
                <Route path='/new-template/:rows/:columns' ><EditTemplate /></Route>
                <Route path='/test1' ><TestPage1 /></Route>
                <Route path='/test2' ><TestPage2 /></Route>
            </Fragment>
        )
    }

    return (
    <ThemeProvider theme={Theme}>
        <ScThemeProvider theme={Theme}>
            <AppFrame getRoutes={getRoutes} menuItems={MenuItems} />
        </ScThemeProvider>
    </ThemeProvider>
    )
}