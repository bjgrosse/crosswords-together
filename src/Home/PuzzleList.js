import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LoadingContainer from '../AppFrame/LoadingContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import PuzzleListItem from './PuzzleListItem';
import { observer } from 'mobx-react';
import { Div, Paper, SubTitle1 } from '../StyledComponents/StyledComponents'

export default observer((props) => {

  return (

    <Div>
      <SubTitle1>
        {props.title}
      </SubTitle1>
      <Paper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader">
          {props.puzzles.map((item, index) => (
            <>
              <PuzzleListItem key={item.id} puzzle={item} />
              {index < props.puzzles.length - 1 && <Divider component="li" />}
            </>
          ))}
        </List>
      </Paper>
    </Div>
  )
})