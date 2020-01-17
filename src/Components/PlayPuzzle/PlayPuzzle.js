import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react";

import useRunOnce from "Utility/useRunOnce";
import useSafeHandler from "Utility/useSafeHandler";
import db from "Database/Database";

// MUI
import LoadingContainer from "AppFrame/LoadingContainer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import PeopleIcon from "@material-ui/icons/PeopleAlt";
import AddPeopleIcon from "@material-ui/icons/GroupAdd";

// UI
import { Div, Paper, SubTitle2, Span } from "UI/StyledComponents";
import { IconButton, Button } from "UI/MaterialComponents";
import Drawer from "UI/Drawer/Drawer";
import MenuButton from "UI/MenuButton";
import { getRandomPlayerColor } from "Theme/Colors";

// App Frame
import AppFrameConfig from "AppFrame/AppFrameConfig";
import { AppContext } from "AppFrame/AppContext";
import Login from "AppFrame/Login";
import PuzzleStore from "Stores/PuzzleStore";

import Puzzle from "../CrosswordPuzzle/CrosswordPuzzle";
import PlayerList from "./PlayerList";
import PlayerColorPicker from "./PlayerColorPicker";
import AddPlayer from "./AddPlayer";

export default observer(props => {
  const store = useRunOnce(() => PuzzleStore.create());
  const promptedForNotifications = useRef();
  const context = useContext(AppContext);
  const [playerListOpen, setPlayerListOpen] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [invitationSender, setInvitationSender] = useState();
  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);
  const { id, templateId } = useParams();

  const addPlayer = () => {
    setAddPlayerOpen(true);
  };

  const handleAddPlayerClose = () => {
    setAddPlayerOpen(false);
  };

  const history = useHistory();
  function navigateTo(path) {
    history.push(path);
  }

  let disposeAutoRun = () => {};
  useEffect(() => {
    return () => {
      disposeAutoRun();
    };
  });

  const fetchInvitation = async () => {
    let invitation = await db.getInvitation(id);
    setInvitationSender(invitation.senderName);
  };
  const fetchPuzzle = async () => {
    if (id) {
      if (props.isInvitation) {
        await store.fetchInvitation(
          id,
          context.appState.user.preferredColors[0]
        );
      } else {
        await store.fetch(id);
      }
    } else if (templateId) {
      let playerColor = getRandomPlayerColor();
      if (
        context.appState.user.preferredColors &&
        context.appState.user.preferredColors.length > 0
      ) {
        playerColor = context.appState.user.preferredColors[0];
      }
      await store.fetchFromTemplate(templateId, playerColor);
    } else {
      throw new Error("no id or templateId paramater found");
    }

    if (context.PushMessaging.pushMessagingSupported) {
      disposeAutoRun = reaction(
        () => [
          store.puzzle.lastCompletedWord,
          promptedForNotifications,
          context.appFrameState.pushNotificationsAllowed,
          store.puzzle.players.length
        ],
        ([
          lastCompletedWord,
          promptedForNotifications,
          pushNotificationsAllowed,
          playerCount
        ]) => {
          if (
            lastCompletedWord &&
            !pushNotificationsAllowed &&
            !promptedForNotifications.current &&
            playerCount > 1
          ) {
            promptedForNotifications.current = true;
            setTimeout(() => setShowNotificationBanner(true), 1000);
          }
        }
      );
    }
  };

  const handleDecline = () => {
    context.appFrameState.setSnackBarMessage("Invitation declined");
    store.puzzle.leaveGame();
    navigateTo("/");
  };

  const handleAccept = () => {
    store.puzzle.acceptInvitation();
  };

  const handlePlay = () => {
    store.puzzle.startPuzzle();
  };

  const hideNotificationBanner = useSafeHandler(() => {
    setShowNotificationBanner(false);
  });

  const turnOnNotifications = useSafeHandler(() => {
    context.PushMessaging.requestPermissions();
    setShowNotificationBanner(false);
  });

  const handleOnInvitation = useSafeHandler(() => {
    if (context.PushMessaging.pushMessagingSupported) {
      context.PushMessaging.requestPermissions();
      if (!context.store.pushNotificationsAllowed) {
        setShowNotificationBanner(true);
      }
    }
  });
  const getInvitationNotice = () =>
    store.invitation &&
    !store.puzzle.isActivePlayer && (
      <Div
        flex
        absolute
        full
        flexCenter
        style={{ background: "rgba(100,100,100,0.5)" }}
      >
        <Paper width="300px" elevation="10" height="auto">
          <Card>
            <CardContent>
              <Typography variant="body2" color="textPrimary" component="p">
                <Span fontWeight="bold">{store.invitation.senderName}</Span> has
                invited you to collaborate on this puzzle.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleDecline}>
                Decline
              </Button>
              <Button size="small" onClick={handleAccept}>
                Accept
              </Button>
            </CardActions>
          </Card>
        </Paper>
      </Div>
    );

  const getPlayNowPopup = () => (
    <Div
      flex
      absolute
      full
      flexCenter
      style={{ background: "rgba(100,100,100,0.5)" }}
    >
      <Paper width="300px" elevation="10" height="auto">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Start this puzzle now!
            </Typography>
            <Div flexCenter>
              <Typography variant="body2" color="textPrimary" component="p">
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={handlePlay}
                >
                  Play
                </Button>
              </Typography>
            </Div>
          </CardContent>
        </Card>
      </Paper>
    </Div>
  );

  // If we're not logged in
  if (!context.appState.user) {
    if (props.isInvitation) {
      return (
        <LoadingContainer
          key="loadingInvitation"
          provideWorkPromise={fetchInvitation}
          message="Retrieving your invitation..."
        >
          <Login>
            <Div my={(1, 1, 2)}>
              <Typography
                variant="body1"
                color="textPrimary"
                align="center"
                component="p"
              >
                Login now to join{" "}
                <Span fontWeight="bold">{invitationSender}</Span>
                <br /> in solving a puzzle.
              </Typography>
            </Div>
          </Login>
        </LoadingContainer>
      );
    } else {
      return <Login />;
    }
  }

  const currentPlayerPending =
    store.puzzle &&
    (!store.puzzle.currentPlayer || store.puzzle.currentPlayer.pending);
  const playersButton =
    store.puzzle &&
    (store.puzzle.players.length > 1 || currentPlayerPending) ? (
      <IconButton
        key="players"
        display={{ xs: "block", md: "none" }}
        size="small"
        onClick={() => setPlayerListOpen(!playerListOpen)}
      >
        <PeopleIcon />
      </IconButton>
    ) : (
      <IconButton
        key="players"
        display={{ xs: "block", md: "none" }}
        size="small"
        onClick={addPlayer}
      >
        <AddPeopleIcon />
      </IconButton>
    );

  const playerColorButton = store.puzzle &&
    store.puzzle.currentPlayer &&
    !store.puzzle.currentPlayer.pending && (
      <PlayerColorPicker player={store.puzzle.currentPlayer} />
    );
  return (
    <LoadingContainer key="loadingPuzzle" provideWorkPromise={fetchPuzzle}>
      {store.puzzle && (
        <AppFrameConfig
          appBarContent={store.puzzle && store.puzzle.title}
          appBarActions={[playerColorButton, playersButton]}
          banners={[
            {
              show: showNotificationBanner,
              content:
                "Turn on notifications to be alerted when a teammate makes progress or sends a message",
              content: "Do you want notifications of activity from teammates?",
              actions: [
                <Button
                  key="no"
                  onClick={hideNotificationBanner}
                  color="secondary"
                  fontWeight="normal"
                >
                  no, thanks
                </Button>,
                <Button
                  key="yes"
                  onClick={turnOnNotifications}
                  color="secondary"
                >
                  Yes
                </Button>
              ]
            }
          ]}
        >
          <Div id="PlayPuzzle" full flex>
            <Div
              display={{ xs: "none", md: "block" }}
              mr={[1, 1, 2]}
              width={200}
            >
              <Paper column>
                <SubTitle2>Players</SubTitle2>
                <Divider />
                <PlayerList
                  puzzle={store.puzzle}
                  onInvitation={handleOnInvitation}
                />
              </Paper>

              {/* <Paper column>
                <SubTitle2>Activity</SubTitle2>
                <Divider />
                <PlayerList puzzle={store.puzzle} onInvitation={handleOnInvitation} />
              </Paper> */}
            </Div>
            <Drawer
              anchor="right"
              open={playerListOpen}
              onClose={() => setPlayerListOpen(false)}
            >
              <SubTitle2 ml={2} mt={2}>
                Players
              </SubTitle2>
              <Divider />
              <PlayerList puzzle={store.puzzle} />
            </Drawer>
            <Div grow relative fullHeight>
              <Puzzle
                puzzle={store.puzzle}
                noticePopover={
                  store.puzzle.isNew ? getPlayNowPopup : getInvitationNotice
                }
              />
            </Div>
            <AddPlayer
              puzzle={store.puzzle}
              open={addPlayerOpen}
              handleClose={handleAddPlayerClose}
            />
          </Div>
        </AppFrameConfig>
      )}
    </LoadingContainer>
  );
});
