import React from "react";
import { Observer } from "mobx-react";
import { Route } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as ScThemeProvider } from "styled-components";

import AppFrame from "./AppFrame/AppFrame";
import { AppContext, AppContextManager } from "./AppFrame/AppContext";

import Home from "./Components/Home/Home";
import Settings from "./Components/Settings/Settings";
import PlayPuzzle from "./Components/PlayPuzzle/PlayPuzzle";
import EditTemplate from "./Components/EditTemplate/EditTemplate";
import StartNewPuzzle from "./Components/Home/StartNewPuzzle";

import MenuItems from "./MenuItems";
import ThemePlayground from "Theme/Playground";

export default props => {
  function getRoutes() {
    return [
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
