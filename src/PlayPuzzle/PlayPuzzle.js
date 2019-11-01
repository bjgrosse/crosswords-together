import React, { useState, useEffect, useContext } from 'react';

import { useMediaQuery } from 'react-responsive';
import LoadingContainer from '../AppFrame/LoadingContainer';
import style from './PlayPuzzle.module.css';
import classnames from 'classnames/bind';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


import { useParams } from "react-router-dom";
import { AppContext } from '../AppFrame/AppFrameContext';
import PuzzleContext from '../CrosswordPuzzle/CrosswordPuzzleContext';

import { observer } from 'mobx-react';
import Puzzle from '../CrosswordPuzzle/CrosswordPuzzle';
import PlayerList from './PlayerList';
import { Div } from '../StyledComponents';

let cx = classnames.bind(style);

export default observer(props => {

  const context = useContext(AppContext);
  const store = useContext(PuzzleContext);

  const { id } = useParams();
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1224px)' })

  const setTitle = (puzzle) => {
    context.setContextBar({ text: store.puzzle.title });
  }

  const fetchPuzzle = async () => {
    console.log("fetch puzzle")
    if (id) {
      let puzzle = await store.fetch(id);
      console.log(puzzle);
      setTitle(puzzle.title)
    } else {

    }
  }


  const getInvitationNotice = () => (
    <Div flex absolute full flexCenter style={{background: 'rgba(100,100,100,0.5)'}}>
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
            <Button size="small" color="primary">Decline</Button>
            <Button size="small" color="primary">Accept</Button>
          </CardActions>
        </Card>

      </Paper>
    </Div>
  )

  return (

    <LoadingContainer provideWorkPromise={fetchPuzzle}>
      {store.puzzle &&
        <div className={cx('container', { 'containerLandscape': !isPortrait })}>
          {!isPortrait && isBigScreen &&
            <div className={cx('section')} >
              <PlayerList players={store.puzzle.players} />
            </div>
          }

          <div className={cx('puzzleContainer')}>
            <Puzzle puzzle={store.puzzle} noticePopover={getInvitationNotice} />
          </div>
        </div>
      }
    </LoadingContainer>
  );
})

