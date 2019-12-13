import React, { Fragment, useEffect } from "react";
import { Observer } from "mobx-react";
import { Route } from "react-router-dom";

import * as firebase from "firebase/app";
import AppFrame from "./AppFrame/AppFrame";
import Login from "./AppFrame/Login";
import Home from "./Components/Home/Home";
import Settings from "./Components/Settings/Settings";
import PlayPuzzle from "./Components/PlayPuzzle/PlayPuzzle";
import EditTemplate from "./Components/EditTemplate/EditTemplate";
import { TestPage1, TestPage2 } from "./Temp/Temp";

import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as ScThemeProvider } from "styled-components";

import MenuItems from "./MenuItems";
import { AppContext, AppContextManager } from "./AppFrame/AppContext";
import "./UI/Animations/Animations.css";
import StartNewPuzzle from "./Components/Home/StartNewPuzzle";
import ThemePlayground from "Theme/Playground";

export default props => {
  function getRoutes() {
    return [
      ,
      <Route path="/settings">
        <Settings />
      </Route>,
      <Route path="/puzzles">
        <Home />
      </Route>,
      <Route path="/start">
        <StartNewPuzzle />
      </Route>,
      <Route path="/puzzle/:id">
        <PlayPuzzle />
      </Route>,
      <Route path="/start-puzzle/:templateId">
        <PlayPuzzle />
      </Route>,
      <Route path="/i/:id">
        <PlayPuzzle isInvitation />
      </Route>,
      <Route path="/edit-template/:id">
        <EditTemplate />
      </Route>,
      <Route path="/new-template/:rows/:columns">
        <EditTemplate />
      </Route>,
      <Route path="/test1">
        <TestPage1 />
      </Route>,
      <Route path="/test2">
        <TestPage2 />
      </Route>,
      <Route path="/theme">
        <ThemePlayground />
      </Route>,

      <Route path="/">
        <Home />
      </Route>
    ];
  }

  return (
    <AppContextManager>
      <AppContext.Consumer>
        {context => (
          <Observer>
            {() => (
              <ThemeProvider theme={context.appState.Theme}>
                <ScThemeProvider theme={context.appState.Theme}>
                  <AppFrame getRoutes={getRoutes} menuItems={MenuItems} />
                </ScThemeProvider>
              </ThemeProvider>
            )}
          </Observer>
        )}
      </AppContext.Consumer>
    </AppContextManager>
  );
};
