import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingContainer from '../AppFrame/LoadingContainer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useParams } from "react-router-dom";
import { AppContext } from '../AppFrame/AppContext';
import PuzzleStore from '../Stores/CrosswordPuzzleStore';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import PeopleIcon from '@material-ui/icons/GroupAdd';
import { observer } from 'mobx-react';
import Login from '../AppFrame/Login'
import Puzzle from '../CrosswordPuzzle/CrosswordPuzzle';
import PlayerList from './PlayerList';
import { Div, Paper, SubTitle2, Span } from '../UI/StyledComponents';
import { IconButton, Button } from '../UI/StyledComponents/MaterialComponents';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import useSafeHandler from '../Utility/useSafeHandler';

import { reaction } from 'mobx'
import db from '../Database/Database';

const store = PuzzleStore.create();

export default observer(props => {
  const promptedForNotifications = useRef()
  const context = useContext(AppContext);
  const [playerListOpen, setPlayerListOpen] = useState(false)
  const [isPermissionPromptOpen, setisPermissionPromptOpen] = useState(false)
  const [showNotificationBanner, setShowNotificationBanner] = useState(false)
  const [invitationSender, setInvitationSender] = useState()

  const { id, templateId } = useParams();
  const isPortrait = useMediaQuery('(orientation: portrait)')
  
  const history = useHistory();
  function navigateTo(path) {
      history.push(path);
  }

  let disposeAutoRun = () => { }
  useEffect(() => {
    return () => {
      disposeAutoRun()
    }
  })

  const fetchInvitation = async () => {
    let invitation = await db.getInvitation(id)
    setInvitationSender(invitation.senderName)
  }
  const fetchPuzzle = async () => {
    if (id) {
      if (props.isInvitation) {
        await store.fetchInvitation(id)
      } else {
        await store.fetch(id);
      }
    } else if (templateId) {
      await store.fetchFromTemplate(templateId);
    } else {
      throw new Error("no id or templateId paramater found")
    }

    disposeAutoRun = reaction(() => [store.puzzle.lastCompletedWord, promptedForNotifications, context.store.pushNotificationsAllowed],
      ([lastCompletedWord, promptedForNotifications, pushNotificationsAllowed]) => {
        if (!pushNotificationsAllowed && !promptedForNotifications.current) {
          promptedForNotifications.current = true
          setTimeout(() => setShowNotificationBanner(true), 1000)
        }
      })

  }

  const handleDecline = () => {
    context.store.setSnackBarMessage("Invitation declined")
    store.puzzle.leaveGame()
    navigateTo("/")
  }

  const handleAccept = () => {
    store.puzzle.acceptInvitation()
  }

  const handlePlay = () => {
    store.puzzle.startPuzzle()
  }

  const handleClosePermissionPrompt = () => setisPermissionPromptOpen(false)
  const handlePermissionsGranted = useSafeHandler(() => {
    store.puzzle.saveNotificationOption(true)
  })

  const hideNotificationBanner = useSafeHandler(() => {
    setShowNotificationBanner(false)
  })


  const turnOnNotifications = useSafeHandler(() => {
    context.PushMessaging.requestPermissions()
    setShowNotificationBanner(false)
  })

  const handleOnInvitation = useSafeHandler(() => {
    context.PushMessaging.requestPermissions()
    if (!context.store.pushNotificationsAllowed) {
      setShowNotificationBanner(true)
    }
  })
  const getInvitationNotice = () => (
    store.invitation && !store.puzzle.isActivePlayer &&
    <Div flex absolute full flexCenter style={{ background: 'rgba(100,100,100,0.5)' }}>
      <Paper width='300px' elevation="10" height='auto'>
        <Card>
          <CardContent>
            <Typography variant="body2" color="textPrimary" component="p">
            <Span fontWeight="bold">{store.invitation.senderName}</Span> has invited you to collaborate on this puzzle.
          </Typography>
          </CardContent>
          <CardActions>
            <Button size="small"  onClick={handleDecline}>Decline</Button>
            <Button size="small"  onClick={handleAccept}>Accept</Button>
          </CardActions>
        </Card>

      </Paper>
    </Div>
  )


  const getPlayNowPopup = () => (
    <Div flex absolute full flexCenter style={{ background: 'rgba(100,100,100,0.5)' }}>
      <Paper width='300px' elevation="10" height='auto'>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Start this puzzle now!
            </Typography>
            <Typography variant="body2" color="textPrimary" component="p">
              <Div flexCenter>
                <Button size="small" variant="contained" color="secondary" onClick={handlePlay}>Play</Button>
              </Div>
            </Typography>
          </CardContent>
        </Card>

      </Paper>
    </Div>
  )

  // If we're not logged in
  if (!context.user) {
    if (props.isInvitation) {
      return (

        <LoadingContainer key="loadingInvitation" provideWorkPromise={fetchInvitation} message="Retrieving your invitation...">
          <Login>
            <Div my={1, 1, 2}>
              <Typography variant="body1" color="textPrimary" align="center" component="p">
                Login now to join <Span fontWeight="bold">{invitationSender}</Span><br/> in solving a puzzle.
            </Typography>
            </Div>
          </Login>
        </LoadingContainer>
      )
    } else {
      return <Login />
    }
  }

  return (
    <>
      <LoadingContainer key="loadingPuzzle" provideWorkPromise={fetchPuzzle}>
        {store.puzzle ?
          <Div
            id="PlayPuzzle"
            full
            flex
          >

            <Div display={{ xs: 'none', md: 'block' }}
              mr={[1, 1, 2]}
              width={200}>

              <Paper column>
                <SubTitle2>Players</SubTitle2>
                <Divider />
                <PlayerList puzzle={store.puzzle} onInvitation={handleOnInvitation} />
              </Paper>
            </Div>
            <Drawer anchor="right" open={playerListOpen} onClose={() => setPlayerListOpen(false)}>

              <SubTitle2 ml={2} mt={2}>Players</SubTitle2>
              <Divider />
              <PlayerList puzzle={store.puzzle} />
            </Drawer>
            <Div grow relative fullHeight >
              <Puzzle puzzle={store.puzzle} noticePopover={store.puzzle.isNew ? getPlayNowPopup : getInvitationNotice} />
            </Div>
          </Div>
          :
          null
        }
      </LoadingContainer>
      <AppFrameConfig
        appBarContent={store.puzzle && store.puzzle.title}
        appBarActions={
          <IconButton display={{ xs: 'block', md: 'none' }} size="small" onClick={() => setPlayerListOpen(true)}><PeopleIcon /></IconButton>
        }
        banners={[
          {
            show: showNotificationBanner,
            content: "Turn on notifications to be alerted when a teammate makes progress or sends a message",
            content: "Do you want notifications of activity from teammates?",
            actions: [
              <Button onClick={hideNotificationBanner} color="secondary" fontWeight="normal">no, thanks</Button>,
              <Button onClick={turnOnNotifications} color="secondary">Yes</Button>
            ]
          }
        ]}
      />
    </>
  );
})

