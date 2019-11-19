import React, { useState, useEffect, useContext } from 'react';
import LoadingContainer from '../AppFrame/LoadingContainer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useParams } from "react-router-dom";
import { AppContext } from '../AppFrame/AppContext';
import PuzzleStore from '../Stores/CrosswordPuzzleStore';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import PeopleIcon from '@material-ui/icons/People';
import { observer } from 'mobx-react';
import Login from '../AppFrame/Login'
import Puzzle from '../CrosswordPuzzle/CrosswordPuzzle';
import PlayerList from './PlayerList';
import { Div, Paper, SubTitle2 } from '../UI/StyledComponents';
import { IconButton } from '../UI/StyledComponents/MaterialComponents';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import useSafeHandler from '../Utility/useSafeHandler';

import { reaction } from 'mobx'

const store = PuzzleStore.create();

export default observer(props => {

  const context = useContext(AppContext);
  const [playerListOpen, setPlayerListOpen] = useState(false)
  const [isPermissionPromptOpen, setisPermissionPromptOpen] = useState(false)
  const [showNotificationBanner, setShowNotificationBanner] = useState(false)

  const { id, templateId } = useParams();
  const isPortrait = useMediaQuery('(orientation: portrait)')
  console.log("isPortrait", isPortrait)
  let disposeAutoRun = () => { }
  useEffect(() => {


    return () => {
      disposeAutoRun()
    }
  })

  const fetchPuzzle = async () => {
    if (id) {
      console.log("Fetch puzzle")
      let puzzle;
      if (props.isInvitation) {
        puzzle = await store.fetchInvitation(id)
      } else {
        puzzle = await store.fetch(id);
      }
    } else if (templateId) {
      await store.fetchFromTemplate(templateId);
    }

    disposeAutoRun = reaction(() => [store.puzzle.selectedWord && store.puzzle.selectedWord.isCompleted, context.store.pushNotificationsAllowed],
      ([isCompleted, pushNotificationsAllowed]) => {
        console.log("reaction", isCompleted, pushNotificationsAllowed)
        if (isCompleted && !pushNotificationsAllowed) {
          setShowNotificationBanner(true)
        }
      })

  }

  const handleDecline = () => {
    //store.acceptInvitation()
  }

  const handleAccept = () => {
    store.acceptInvitation()
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

  const getInvitationNotice = () => (
    store.invitation && !store.invitation.accepted &&
    <Div flex absolute full flexCenter style={{ background: 'rgba(100,100,100,0.5)' }}>
      <Paper width='300px' elevation="10" height='auto'>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              You're Invited!
            </Typography>
            <Typography variant="body2" color="textPrimary" component="p">
              Ben has invited you to collaborate on this puzzle.
          </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="secondary" onClick={handleDecline}>Decline</Button>
            <Button size="small" color="secondary" onClick={handleAccept}>Accept</Button>
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

        <Login>
          <Div my={1, 1, 2}>
            <Typography variant="body" color="textPrimary" align="center" component="p">
              You have been invited to collaborate on a puzzle. Login now to start playing!
            </Typography>
          </Div>
        </Login>
      )
    } else {
      return <Login />
    }
  }

  return (
    <>
      <LoadingContainer provideWorkPromise={fetchPuzzle}>
        {store.puzzle &&
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
                <PlayerList puzzle={store.puzzle} />
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
            actions: [
              <Button onClick={hideNotificationBanner}>not now</Button>,
              <Button onClick={turnOnNotifications}>turn on</Button>
            ]
          }
        ]}
      />
    </>
  );
})

