import React, { Fragment, useContext } from "react";
import { observer } from "mobx-react";
import { AppContext } from "AppFrame/AppContext";

import PuzzlesStore from "Stores/PuzzlesStore";
import PuzzleList from "./PuzzleList";
import TemplateList from "./TemplateList";
import LoadingContainer from "AppFrame/LoadingContainer";
import AppFrameConfig from "AppFrame/AppFrameConfig";
import Login from "AppFrame/Login";
import { Div } from "UI/StyledComponents/StyledComponents";
import WelcomeMessage from "./WelcomeMessage";
import NewPuzzleMessage from "./NewPuzzleMessage";
import { Typography } from "@material-ui/core";
import InlineLogo from "./InlineLogo";

function Home(props) {
  const context = useContext(AppContext);

  const loadPuzzles = async () => {
    await context.appState.puzzlesStore.fetch();
  };

  let content;
  if (context.appState.user) {
    content = (
      <LoadingContainer provideWorkPromise={loadPuzzles}>
        <Fragment>
          <Div fullWidth>
            {context.appState.puzzlesStore.puzzles.length == 0 ? (
              <WelcomeMessage />
            ) : (
              <NewPuzzleMessage />
            )}

            {context.appState.puzzlesStore.pendingInvitations.length > 0 && (
              <PuzzleList
                key="invites"
                puzzles={context.appState.puzzlesStore.pendingInvitations}
                title="Pending invitations..."
              />
            )}

            {context.appState.puzzlesStore.activePuzzles.length > 0 && (
              <PuzzleList
                key="active"
                puzzles={context.appState.puzzlesStore.activePuzzles}
                title="My puzzles..."
              />
            )}
          </Div>
        </Fragment>
      </LoadingContainer>
    );
  } else {
    return (content = <Login />);
  }

  return (
    <AppFrameConfig
      showMenu={true}
      appBarContent={
        <Div width={[256, 256, 400]} ml={1}>
          <img
            style={{ verticalAlign: "middle" }}
            src={
              context.appState.useLightTheme
                ? "/logo-inline.svg"
                : "/logo-inline-dark.svg"
            }
            alt="CROSSWORDS together"
            width="100%"
          />
        </Div>
        // <InlineLogo />
      }
    >
      {content}
    </AppFrameConfig>
  );
}

export default observer(Home);
